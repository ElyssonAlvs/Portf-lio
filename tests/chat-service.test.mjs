import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sendMessageStream } from '../src/lib/chat-service.ts';

function createMockStreamResponse(chunks, { status = 200, statusText = 'OK', headers = {} } = {}) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status,
    statusText,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...headers,
    },
  });
}

describe('Client Service - sendMessageStream', () => {
  it('deve rejeitar mensagens vazias antes de enviar requisição', async () => {
    await assert.rejects(
      async () => {
        await sendMessageStream('   ', () => {});
      },
      {
        message: 'A mensagem não pode estar vazia.',
      }
    );
  });

  it('deve transmitir pedaços de texto em tempo real via callback onChunk', async () => {
    const originalFetch = globalThis.fetch;
    const receivedChunks = [];

    globalThis.fetch = async (url, options) => {
      assert.strictEqual(url, '/api/chat');
      assert.strictEqual(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.strictEqual(body.message, 'Qual sua formação?');

      return createMockStreamResponse(['Bacharelado ', 'em Sistemas ', 'de Informação (UFC).']);
    };

    try {
      await sendMessageStream('Qual sua formação?', (chunk) => {
        receivedChunks.push(chunk);
      });

      assert.deepStrictEqual(receivedChunks, [
        'Bacharelado ',
        'em Sistemas ',
        'de Informação (UFC).',
      ]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('deve repassar o AbortSignal para cancelar a requisição ou leitura', async () => {
    const originalFetch = globalThis.fetch;
    const controller = new AbortController();

    globalThis.fetch = async (_url, options) => {
      assert.strictEqual(options.signal, controller.signal);
      const stream = new ReadableStream({
        async start(ctrl) {
          ctrl.enqueue(new TextEncoder().encode('chunk 1'));
          // Wait and let abort occur
          await new Promise((r) => setTimeout(r, 50));
          ctrl.close();
        },
      });
      return new Response(stream, { status: 200 });
    };

    try {
      const chunks = [];
      const promise = sendMessageStream(
        'Olá',
        (chunk) => chunks.push(chunk),
        controller.signal
      );
      controller.abort();
      await assert.rejects(promise);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('deve formatar erro de rate limit (429) em mensagem amigável', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ error: 'Too Many Requests. Limite de 10 requisições por minuto excedido.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    };

    try {
      await assert.rejects(
        async () => {
          await sendMessageStream('Pergunta rápida', () => {});
        },
        (err) => {
          assert.match(err.message, /10 requisições por minuto excedido/i);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('deve tratar erro 503 quando o serviço de IA estiver temporariamente indisponível', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ error: 'O serviço de chat está temporariamente indisponível. Tente novamente em instantes.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    };

    try {
      await assert.rejects(
        async () => {
          await sendMessageStream('Pergunta teste', () => {});
        },
        (err) => {
          assert.match(err.message, /temporariamente indisponível/i);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

/**
 * Chat client service for interacting with the /api/chat serverless streaming endpoint.
 */

export interface SendMessageStreamOptions {
  signal?: AbortSignal;
}

/**
 * Sends a user message to /api/chat and streams back incremental text deltas.
 *
 * @param message The prompt message to send (1-500 chars).
 * @param onChunk Callback invoked whenever a new text chunk is received.
 * @param signal Optional AbortSignal to cancel in-flight request/stream.
 */
export async function sendMessageStream(
  message: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('A mensagem não pode estar vazia.');
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: trimmed }),
    signal,
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson && typeof errorJson.error === 'string') {
        errorMessage = errorJson.error;
      }
    } catch {
      if (response.status === 429) {
        errorMessage =
          'Limite de requisições excedido. Por favor, aguarde um instante antes de enviar nova mensagem.';
      } else if (response.status === 503) {
        errorMessage =
          'O assistente de IA está temporariamente indisponível. Tente novamente em alguns segundos.';
      }
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error('ReadableStream não suportado na resposta da API.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('Request aborted by user', 'AbortError');
      }

      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      if (chunkText) {
        onChunk(chunkText);
      }
    }

    // Flush any remaining multibyte characters
    const remainingText = decoder.decode();
    if (remainingText) {
      onChunk(remainingText);
    }
  } finally {
    reader.releaseLock();
  }
}

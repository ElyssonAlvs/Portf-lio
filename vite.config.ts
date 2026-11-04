import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler } from './api/chat.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Lightweight Vite dev plugin that intercepts /api/chat requests
 * and delegates to the serverless Edge handler in api/chat.ts.
 * Enables full end-to-end local testing in the browser during `npm run dev`.
 */
export function apiChatDevPlugin(): Plugin {
  return {
    name: 'api-chat-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0] : '';
        if (urlPath !== '/api/chat' && urlPath !== '/Portf-lio/api/chat') {
          return next();
        }

        try {
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const host = req.headers['host'] || 'localhost:5173';
          const fullUrl = new URL(req.url || '/api/chat', `${protocol}://${host}`).toString();

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const val of value) {
                headers.append(key, val);
              }
            } else {
              headers.set(key, value);
            }
          }

          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

          const webReq = new Request(fullUrl, {
            method: req.method || 'POST',
            headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
            // Node.js RequestInit supports duplex for streaming bodies
            duplex: 'half',
          } as RequestInit);

          const webRes = await handler(webReq);
          res.statusCode = webRes.status;
          webRes.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });

          if (!webRes.body) {
            res.end();
            return;
          }

          const reader = webRes.body.getReader();
          req.on('close', () => {
            reader.cancel().catch(() => {});
          });

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch (err) {
          console.error('[apiChatDevPlugin] Error handling /api/chat:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.end();
          }
        }
      });
    },
  };
}

/**
 * Resolves the application base path depending on the deployment environment:
 * - Vercel or localhost: '/'
 * - GitHub Pages (or GitHub Actions): '/Portf-lio/'
 */
export function resolveBase(
  env: { VERCEL?: string; GITHUB_PAGES?: string; GITHUB_ACTIONS?: string } = process.env
): string {
  return env.VERCEL
    ? '/'
    : env.GITHUB_PAGES || env.GITHUB_ACTIONS
      ? '/Portf-lio/'
      : '/';
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv(mode, __dirname, ''),
    ...loadEnv(mode, process.cwd(), ''),
  };

  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GROQ_API_KEY && !process.env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = env.GROQ_API_KEY;
  }

  const base = resolveBase(process.env);

  return {
    base,
    plugins: [react(), apiChatDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

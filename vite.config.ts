import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const MAX_VIDEO_CHUNK_BYTES = 4 * 1024 * 1024; // 4 MiB per Range chunk (safe well under Cloud Run 32 MiB limit)

function chunkedVideoRangePlugin(): Plugin {
  const attachMiddleware = (
    middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void },
    rootDir: string,
  ) => {
    middlewares.use((req, res, next) => {
      if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
        return next();
      }
      const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
      if (!cleanUrl.toLowerCase().endsWith('.mp4')) {
        return next();
      }

      const publicDir = path.resolve(rootDir, 'public');
      const filePath = path.resolve(publicDir, cleanUrl.replace(/^\/+/, ''));
      if (!filePath.startsWith(publicDir + path.sep) || !fs.existsSync(filePath)) {
        return next();
      }

      const stat = fs.statSync(filePath);
      const total = stat.size;
      const rangeHeader = req.headers.range as string | undefined;

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      if (rangeHeader && rangeHeader.startsWith('bytes=')) {
        const [startStr, endStr] = rangeHeader.replace(/^bytes=/, '').split('-');
        let start = startStr ? parseInt(startStr, 10) : 0;
        let end = endStr ? parseInt(endStr, 10) : Math.min(start + MAX_VIDEO_CHUNK_BYTES - 1, total - 1);

        if (Number.isNaN(start) || start < 0 || start >= total) {
          res.statusCode = 416;
          res.setHeader('Content-Range', `bytes */${total}`);
          res.end();
          return;
        }
        if (Number.isNaN(end) || end >= total) {
          end = total - 1;
        }
        // Cap single response chunk to MAX_VIDEO_CHUNK_BYTES for smooth streaming across proxies
        if (end - start + 1 > MAX_VIDEO_CHUNK_BYTES) {
          end = Math.min(start + MAX_VIDEO_CHUNK_BYTES - 1, total - 1);
        }

        const chunkSize = end - start + 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
        res.setHeader('Content-Length', chunkSize);

        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        const stream = fs.createReadStream(filePath, {start, end});
        stream.on('error', () => {
          if (!res.headersSent) res.statusCode = 500;
          res.end();
        });
        stream.pipe(res);
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Length', total);
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        if (!res.headersSent) res.statusCode = 500;
        res.end();
      });
      stream.pipe(res);
    });
  };

  return {
    name: 'chunked-video-range',
    configureServer(server) {
      attachMiddleware(server.middlewares, server.config.root);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares, server.config.root);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), chunkedVideoRangePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

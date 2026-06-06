import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";
import fs from 'fs';
import nodePath from 'path';

function setAtPath(obj: Record<string, unknown>, dotPath: string, value: string | number | null): void {
  const keys = dotPath.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        {
          name: 'site-content-api',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          configureServer(server: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            server.middlewares.use('/api/update-content', (req: any, res: any, next: any) => {
              if (req.method !== 'POST') return next();
              let body = '';
              req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
              req.on('end', () => {
                try {
                  const { path: keyPath, value } = JSON.parse(body) as { path: string; value: string | number | null };
                  const filePath = nodePath.join(process.cwd(), 'src/content/site-content.json');
                  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>;
                  setAtPath(content, keyPath, value);
                  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: String(e) }));
                }
              });
            });
          },
        },
      ],
      optimizeDeps: {
        include: [
          '@principal-ade/industry-theme',
          '@principal-ai/logo-component',
        ],
      },
    });
  },
};
export default config;

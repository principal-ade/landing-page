import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";

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
      resolve: {
        alias: {
          '@a24z/logo-component': '/Users/julieallen/Desktop/Principal web/landing-page/node_modules/@a24z/logo-component/dist/esm/index.js',
        },
      },
      optimizeDeps: {
        include: [
          '@a24z/industry-theme',
          '@a24z/dynamic-file-tree',
          '@principal-ai/repository-abstraction',
        ],
        exclude: ['@a24z/logo-component'],
      },
    });
  },
};
export default config;
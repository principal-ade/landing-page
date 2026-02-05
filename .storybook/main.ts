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
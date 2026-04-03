import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import { ThemeProvider, iceTangerineTheme } from '@principal-ade/industry-theme'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={iceTangerineTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;

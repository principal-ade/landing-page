import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import { ThemeProvider, iceTangerineTheme } from '@principal-ade/industry-theme'
import { Inter, Fira_Code, Space_Grotesk } from 'next/font/google'
import '../src/app/globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
})

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
      <div className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}>
        <ThemeProvider theme={iceTangerineTheme}>
          <Story />
        </ThemeProvider>
      </div>
    ),
  ],
};

export default preview;

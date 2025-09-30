# Code City Landing

This is the landing page for Code City - an interactive 2D visualization tool for exploring codebases.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Core library (monorepo dependency)

## Project Structure

```
code-city-landing/
├── src/
│   └── app/
│       ├── layout.tsx    # Root layout with metadata
│       ├── page.tsx      # Homepage
│       └── globals.css   # Global styles
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Development

The app runs on port 3002 to avoid conflicts with other Next.js apps in the monorepo.
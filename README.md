# Principal ADE Landing Page

This is the landing page for Principal ADE - an AI-powered development environment with interactive codebase visualization.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Core library (monorepo dependency)

## Project Structure

```
landing-page/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── lib/              # Utility functions
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Environment Variables

See `.env.example` for optional configuration (Google Analytics, AWS S3, GitHub releases token, etc.)
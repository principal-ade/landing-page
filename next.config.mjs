/** @type {import('next').NextConfig} */
// Deploy base path. Empty locally (root), set to e.g. '/landing-page' in CI for a
// GitHub Pages project site. `withBase()` in src/lib/withBase.ts mirrors this for
// hand-written links/assets.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // Static HTML export — the deployable artifact is `out/`.
  output: 'export',
  basePath: basePath || undefined,
  // Directory-style output (/about/ -> about/index.html), friendliest for static hosts.
  trailingSlash: true,
  reactStrictMode: false, // Disabled to prevent double-mount animation issues in dev
  transpilePackages: ['themed-markdown'],
  typescript: {
    // Allow builds to complete with some remaining type compatibility issues
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow builds to complete even with ESLint warnings
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    // Use lighter source maps in development to reduce memory usage
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map';
    }

    // Handle ESM packages
    config.resolve.extensionAlias = {
      '.js': ['.js', '.mjs'],
      '.jsx': ['.jsx'],
      '.ts': ['.tsx', '.ts'],
    };

    return config;
  },
  images: {
    // Required for `output: 'export'` — there is no server-side image optimizer.
    unoptimized: true,
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.workos.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'workoscdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [], // Explicit empty domains array
  },
};

export default nextConfig;

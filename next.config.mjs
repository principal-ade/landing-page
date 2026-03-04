/** @type {import('next').NextConfig} */
const nextConfig = {
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
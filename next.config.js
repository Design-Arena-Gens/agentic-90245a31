/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'agentic-90245a31.vercel.app']
    }
  },
  eslint: {
    dirs: ['app', 'components', 'lib']
  }
};

module.exports = nextConfig;

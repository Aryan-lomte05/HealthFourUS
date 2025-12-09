/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Silence Turbopack warning
  turbopack: {},
  
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // ✅ Make uploads folder publicly accessible
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@buchhaltung/db"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { "@prisma/client": "@prisma/client" }];
    return config;
  },
};

module.exports = nextConfig;

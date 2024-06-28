/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  output: "standalone",
  publicRuntimeConfig: {
    DebugMode: process.env.DebugMode === "true" ? true : false,
    BackEnd: process.env.BackEnd,
    Routing: process.env.Routing,
  },
  basePath: "/management",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

};

module.exports = nextConfig;

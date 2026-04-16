/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ai-node/ui", "@ai-node/types"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;

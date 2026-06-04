/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@downtimed/types", "@downtimed/utils", "@downtimed/db"],
};

export default nextConfig;

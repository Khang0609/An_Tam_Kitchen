import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/types", "@repo/database", "@repo/repositories"],
};

export default nextConfig;

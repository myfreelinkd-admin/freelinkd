import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "mongodb": "commonjs mongodb",
    });
    return config;
  },
};

export default nextConfig;

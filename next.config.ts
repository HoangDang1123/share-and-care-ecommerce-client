import type { NextConfig } from "next";

module.exports = {
  compiler: {
    // Remove all console logs
    removeConsole: false
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

const nextConfig: NextConfig = {
};

export default nextConfig;

import type { NextConfig } from "next";

module.exports = {
  compiler: {
    // Remove all console logs
    removeConsole: false
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

const nextConfig: NextConfig = {
};

export default nextConfig;

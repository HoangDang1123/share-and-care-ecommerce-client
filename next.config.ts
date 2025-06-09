import type { NextConfig } from "next";

module.exports = {
  compiler: {
    // Remove all console logs
    removeConsole: false
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'www.youtube.com',
      'img.youtube.com',
      'via.placeholder.com',
      'example.com'
    ],
  },
  devIndicators: {
    position: false
  }
};

const nextConfig: NextConfig = {
};

export default nextConfig;

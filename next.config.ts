// In your CHATBOT project: /next.config.js - RECOMMENDED

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' http://localhost:3000  http://localhost:3001 http://localhost:5173",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
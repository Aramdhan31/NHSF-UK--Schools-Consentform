import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  /**
   * Opening the dev server via a LAN IP (e.g. http://192.168.0.70:3000) sends
   * Origin: that host. Next.js otherwise 403s dev assets + webpack-hmr WebSocket.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
   */
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "127.0.0.1",
  ],
};

export default nextConfig;

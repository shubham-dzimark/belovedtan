import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server (`npm run dev`) be opened through a tunnel for sharing. Without this,
  // Next.js blocks its dev scripts on other hostnames and pages load without JavaScript.
  // Production (`npm run build && npm start`) doesn't need it.
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
  ],
  experimental: {
    serverActions: {
      // Puck page JSON is sent to server actions when saving/publishing.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

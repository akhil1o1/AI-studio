import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
   dest: "public",
   register: true,
   skipWaiting: true,
   disable: process.env.NODE_ENV === "development", // disable in dev
});

const nextConfig: NextConfig = {

   images: {
      remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
   },
   // Increase body size limit for file uploads
   experimental: {
      serverActions: {
         bodySizeLimit: "3mb", // Set to 3MB to handle 2MB files with overhead
      },
   },
};

export default withPWA(nextConfig);

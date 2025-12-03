import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // --- ADICIONE ESTE BLOCO ---
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/uploads/**', 
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;

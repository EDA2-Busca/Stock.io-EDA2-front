import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // --- ADICIONE ESTE BLOCO ---
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.infoescola.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
    // Evita falhas de otimização quando DNS externo oscila (usa a imagem direta)
    unoptimized: true,
  },
  // -------------------------
};

export default nextConfig;

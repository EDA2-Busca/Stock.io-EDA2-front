import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // --- ADICIONE ESTE BLOCO ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.infoescola.com', // O domínio da imagem do tatu
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Para o seu placeholder.png
      },
      // Adicione outros domínios aqui conforme precisar
      // Ex: { protocol: 'https', hostname: 'meu-s3-bucket.amazonaws.com' }
    ],
  },
  // -------------------------
};

export default nextConfig;

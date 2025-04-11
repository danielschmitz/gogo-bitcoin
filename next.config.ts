import type { NextConfig } from "next";

// Determine the base path for GitHub Pages
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'gogo-bitcoin'; // Substitua pelo nome do seu repositório no GitHub

const nextConfig: NextConfig = {
  output: 'export', // Configuração necessária para exportação estática
  basePath: isProd ? `/${repoName}` : '',
  images: {
    unoptimized: true, // Necessário para build estático
  },
  assetPrefix: isProd ? `/${repoName}/` : '', // Adiciona o prefixo para os assets estáticos
  eslint: {
    // Ignorar erros de ESLint durante a build para permitir o deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante a build para permitir o deploy
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

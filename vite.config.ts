
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite para 1.6MB para acomodar pacotes de IA e Web3 sem warnings desnecessários
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Estratégia de divisão de pacotes para melhor performance e cache
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('ethers') || id.includes('@noble')) {
              return 'vendor-web3';
            }
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            if (id.includes('@supabase')) {
              return 'vendor-db';
            }
            if (id.includes('lucide-react') || id.includes('react')) {
              return 'vendor-core';
            }
            return 'vendor-others';
          }
        },
      },
    },
  },
});

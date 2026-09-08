import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /*
          Separa las dependencias en su propio bloque: sin esto, cambiar un
          texto invalida la caché de React entera.

          Vite 8 compila con rolldown, donde `manualChunks` tiene que ser una
          función. La forma de objeto (`{ vendor: [...] }`) que funcionaba con
          rollup falla con "manualChunks is not a function".
        */
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
      },
    },
  },
});

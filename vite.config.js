import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['redux', 'react-redux', 'redux-thunk', 'redux-logger'],
            ui: ['semantic-ui-react', 'semantic-ui-css'],
            charts: ['recharts'],
          },
        },
      },
    },
    esbuild: {
      loader: 'tsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx',
          '.tsx': 'tsx',
        },
      },
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          VITE_GA4_TRACKING_ID: process.env.VITE_GA4_TRACKING_ID || "",
          VITE_ADSENSE_CLIENT: process.env.VITE_ADSENSE_CLIENT || "",
          VITE_URL: process.env.VITE_URL || "https://madgrades.com",
        },
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["./src", "./node_modules"],
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});

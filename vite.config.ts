import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    proxy: {
      "/anime": {
        target: "https://api.consumet.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anime/, "/anime/gogoanime"),
      },
    },
  },
});

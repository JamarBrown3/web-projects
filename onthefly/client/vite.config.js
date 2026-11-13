import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backend = "http://localhost:3001";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": { target: backend, changeOrigin: true },
      "/auth": { target: backend, changeOrigin: true },
    },
  },
});
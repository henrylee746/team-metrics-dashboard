/*eslint-disable*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        //all requests w/ api route are proxied to server address
        target: "http://localhost:5001", // Your backend server's address
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), //strips the /api portion of the route before request gets sent to backend
      },
    },
  },
});

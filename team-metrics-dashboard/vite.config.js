/*eslint-disable*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Use SWC instead of Babel
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
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // define index.html location
  root: "./../../",
  optimizeDeps: {
    exclude: ['node:http', 'node-fetch'],
  },
});

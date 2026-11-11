import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base = subruta de GitHub Pages (https://joel5vega.github.io/dones/)
export default defineConfig({
  base: "/dones/",
  plugins: [react()],
  build: { outDir: "build" },
});

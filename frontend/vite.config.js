/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV !== "production" ? "/" : "/static/modern/",
  plugins: [svgr()],
  define: {
    __DEV__: process.env.NODE_ENV !== "production",
  },
  envDir: "..",
  build: { outDir: "../static", emptyOutDir: false },
});

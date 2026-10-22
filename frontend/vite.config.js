/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr()],
  define: {
    __DEV__: process.env.NODE_ENV !== "production",
  },
  envDir: "..",
  server: {
    host: "127.0.0.1",
    proxy: Object.fromEntries(
      ["/admin", "/accounts", "/inventory", "/report", "/static", "/media", "/graphql"].map(
        (path) => [path, process.env.VITE_DEV_API_PROXY || "http://127.0.0.1:3000"],
      ),
    ),
  },
  build: { outDir: "../static", emptyOutDir: false },
});

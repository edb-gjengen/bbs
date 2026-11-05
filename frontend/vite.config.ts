import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
  define: {
    __DEV__: process.env.NODE_ENV !== "production",
  },
  envDir: "..",
  server: {
    host: "127.0.0.1",
    proxy: Object.fromEntries(
      ["/admin", "/accounts", "/static", "/media", "/graphql"].map((path) => [
        path,
        {
          target: process.env.VITE_DEV_API_PROXY || "http://127.0.0.1:3000",
          // Django only accepts a login form posted from the Host it was sent to (CSRF), so keep the
          // app's own Host for the local backend. A remote backend needs its own Host to be reached.
          changeOrigin: !!process.env.VITE_DEV_API_PROXY,
        },
      ]),
    ),
  },
  build: { outDir: "../static", emptyOutDir: false },
});

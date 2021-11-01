/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import reactSvgPlugin from "vite-plugin-react-svg";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactSvgPlugin({ defaultExport: "component" })],
  define: {
    __DEV__: process.env.NODE_ENV !== "prodution",
  },
  envDir: "..",
});

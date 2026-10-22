/// <reference types="vite-plugin-svgr/client" />

/* CSS modules */
declare module "*.module.css";

/* Vite env vars */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

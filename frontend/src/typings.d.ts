/* svgs */
declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";
  export const ReactComponent: (props: SVGProps<SVGElement>) => ReactElement;
}
/* CSS modules */
declare module "*.module.css";

/* Vite env vars */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

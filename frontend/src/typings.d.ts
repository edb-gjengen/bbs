/* svgs */
declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
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

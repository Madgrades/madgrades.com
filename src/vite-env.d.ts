/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MADGRADES_API: string;
  readonly VITE_MADGRADES_API_TOKEN: string;
  readonly VITE_URL?: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_GA4_TRACKING_ID?: string;
  readonly VITE_UA_TRACKING_ID?: string;
  readonly VITE_UPTIME_ROBOT_API_KEY?: string;
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_ADSENSE_SIDEBAR_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'dom-to-image' {
  export interface Options {
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    quality?: number;
  }

  export function toBlob(node: Node, options?: Options): Promise<Blob>;
  export function toPng(node: Node, options?: Options): Promise<string>;
  export function toJpeg(node: Node, options?: Options): Promise<string>;
  export function toSvg(node: Node, options?: Options): Promise<string>;
}

declare module 'file-saver' {
  export function saveAs(data: Blob | string, filename?: string, options?: { autoBom?: boolean }): void;
  export default { saveAs };
}

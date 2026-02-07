/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MADGRADES_API?: string;
  readonly VITE_MADGRADES_API_TOKEN?: string;
  readonly VITE_GA4_TRACKING_ID?: string;
  readonly VITE_ADSENSE_CLIENT?: string;
  readonly VITE_URL?: string;
  readonly VITE_UPTIME_ROBOT_API_KEY?: string;
  readonly VITE_ADSENSE_SIDEBAR_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

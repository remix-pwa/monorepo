// Vite ✨
export { RemixPWA as remixPWA } from './vite/index.js';
export type { PWAOptions as PWAViteOptions } from './vite/types.js';

export interface WebAppManifest {
  name?: string;
  short_name?: string;
  description?: string;
  icons?: Array<{
    src: string;
    sizes?: string;
    type?: string;
    purpose?: 'any' | 'maskable' | 'monochrome';
  }>;
  start_url?: string;
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  display_override?: Array<'window-controls-overlay' | 'bordered' | 'standard'>;
  orientation?:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary';
  dir?: 'ltr' | 'rtl' | 'auto';
  lang?: string;
  prefer_related_applications?: boolean;
  related_applications?: Array<{
    platform: string;
    url?: string;
    id?: string;
    min_version?: string;
    fingerprints?: Array<{
      type: string;
      value: string;
    }>;
  }>;
  scope?: string;
  screenshots?: Array<{
    src: string;
    sizes?: string;
    type?: string;
    platform?: string;
    label?: string;
  }>;
  shortcuts?: Array<{
    name?: string;
    short_name?: string;
    description?: string;
    url?: string;
    icons?: Array<{
      src: string;
      sizes?: string;
      type?: string;
      purpose?: 'any' | 'maskable' | 'monochrome';
    }>;
  }>;
  share_target?: {
    action?: string;
    method?: 'GET' | 'POST';
    enctype?: string;
    params?: {
      [key: string]: {
        name?: string;
        title?: string;
        description?: string;
      };
    };
  };
  protocol_handlers?: Array<{
    protocol: string;
    url: string;
  }>;
  note?: string;
  background_color?: string;
  theme_color?: string;
  categories?: Array<string>;
  iarc_rating_ids?: Array<string>;
}

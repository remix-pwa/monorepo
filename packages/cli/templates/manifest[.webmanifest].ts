import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@remix-run/node';

export const loader = () => {
  return json(
    <WebAppManifest>{
      short_name: 'PWA',
      name: 'Remix PWA',
      start_url: '/',
      display: 'standalone',
      background_color: '#d3d7dd',
      theme_color: '#c34138',
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};

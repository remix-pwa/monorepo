import { PWAViteOptions, remixPWA } from '@remix-pwa/dev';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { flatRoutes } from 'remix-flat-routes';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { iconsSpritesheet } from 'vite-plugin-icons-spritesheet';

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*'],
      routes: async defineRoutes => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: ['**/__*.*'],
        });
      },
    }),
    tsconfigPaths(),
    remixPWA(<Partial<PWAViteOptions>>{
      // workerEntryPoint: './runtime.js'
    }),
    iconsSpritesheet({
      withTypes: true,
      inputDir: "icons",
      outputDir: "public/icons",
      typesOutputFile: "app/icons.ts",
      iconNameTransformer: (iconName) => iconName,
    }),
  ],
  server: {
    port: 3_000,
  },
});

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";
import { PWAViteOptions } from "@remix-pwa/dev";
import { remixPWA } from '@remix-pwa/dev';

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
    remixPWA(<Partial<PWAViteOptions>>{
      // workerEntryPoint: './runtime.js'
    }),
  ],
  server: {
    port: 3_000,
  }
});
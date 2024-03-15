import { vitePlugin as remix } from "@remix-run/dev";
import { unstable_RemixPWA as remixPwa } from "@remix-pwa/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";
import { PWAOptions } from "@remix-pwa/dev/vite/types";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
    remixPwa(<Partial<PWAOptions>>{
      // workerMinify: true,
      // workerSourceMap: true,
    }),
  ],
  server: {
    port: 3_000,
  }
});
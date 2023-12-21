import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { unstable_RemixPWA as remixPwa } from "@remix-pwa/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { PWAOptions } from "@remix-pwa/dev/vite/types";

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
});
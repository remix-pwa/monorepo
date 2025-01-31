import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixPWA } from '@remix-pwa/dev';
import { remixDevTools } from "remix-development-tools";

installGlobals();

const spaMode = process.env.SPA === 'true' || false;

export default defineConfig({
  plugins: [
    remixDevTools(),
    remix({
      ignoredRouteFiles: ["**/.*"],
      appDirectory: spaMode ? './spa' : './app',
      ssr: !spaMode,
      future: {
        unstable_singleFetch: false
      }
    }),
    tsconfigPaths(),
    remixPWA({
      buildVariables: {
        'process.env.NODE_ENV': process.env.NODE_ENV ?? 'production',
        'process.env.API_URL': 'https://api.example.com',
        'miscellaneous': 'value',
      }
      // workerEntryPoint: './runtime.js'
    }),
  ],
  resolve: {
    alias: {
      '~/*': './app/*',
      '@/*': './spa/*',
    },
  },
  server: {
    port: 3_000,
  }
});
import type { ResolvedConfig } from 'vite';

export const mockViteConfig = <Partial<ResolvedConfig>>{
  base: '/',
  mode: 'development',
  root: '/Users/ryan/Projects/remix-pwa',
  configFile: '/Users/ryan/Projects/remix-pwa/vite.config.ts',
  plugins: [],
  publicDir: '/Users/ryan/Projects/remix-pwa/public',
  resolve: {
    alias: [],
    dedupe: [],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    symlinks: true,
    conditions: ['import', 'require', 'node'],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'module', 'main'],
    preserveSymlinks: false,
    preferRelative: false,
  },
  __remixPluginContext: {
    remixConfig: {
      appDirectory: '/Users/ryan/Projects/remix-pwa/app',
      rootDirectory: '/Users/ryan/Projects/remix-pwa',
      routes: {},
      assetsBuildDirectory: '/Users/ryan/Projects/remix-pwa/public/build',
      ignoredRouteFiles: ['**/.*'],
      publicPath: '/build/',
    },
  },
};

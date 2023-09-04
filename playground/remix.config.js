/** @type {import('@remix-pwa/dev').WorkerConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  tailwind: true,
  serverDependenciesToBundle: [
    '@remix-pwa/sw',
    '@remix-pwa/strategy',
    '@remix-pwa/dev',
    '@remix-pwa/sync',
    '@remix-pwa/cache',
    'idb'
  ]
};

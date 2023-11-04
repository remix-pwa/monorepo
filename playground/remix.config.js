/** @type {import('@remix-pwa/dev').WorkerConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  tailwind: true,
  serverDependenciesToBundle: [
    '@remix-pwa/sw',
    '@remix-pwa/strategy',
    '@remix-pwa/dev',
    '@remix-pwa/sync',
    '@remix-pwa/cache',
    'idb',
  ],
};

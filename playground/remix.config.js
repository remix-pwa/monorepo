/** @type {import('@remix-pwa/dev').WorkerConfig} */
export default {
  ignoredRouteFiles: ['**/.*'],
  tailwind: true,
  serverDependenciesToBundle: ['idb'],
};

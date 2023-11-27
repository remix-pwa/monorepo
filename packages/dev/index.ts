export { run } from './cli/run.js';

// For debugging processes I guess, you would almost never use this
// and you shouldn't
export { runCompiler } from './compiler/compiler.js';
export type { WorkerConfig as AppConfig, WorkerConfig } from './compiler/utils/config.js';

// todo: Automatically add "WebWorker" to the user tsconfig

// Vite ✨
// eslint-disable-next-line camelcase
export { RemixPWA as unstable_RemixPWA } from './vite/index.js';

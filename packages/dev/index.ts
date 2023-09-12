export { run } from './cli/run.js';

// For debugging processes I guess, you would almost never use this
// and you shouldn't
export { runCompiler } from './compiler/compiler.js';
export type { WorkerConfig } from './compiler/utils/config.js';

// todo: Automatically add "WebWorker" to the user tsconfig

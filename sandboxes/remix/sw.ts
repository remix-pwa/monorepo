#!/usr/bin/env ts-node
//@ts-nocheck

(async () => {
  const run = (await import('../packages/dev/dist/index.js')).run;

  await run();
})();


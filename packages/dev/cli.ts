import { run } from './index.js';

run().then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  }
);

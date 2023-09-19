#!/usr/bin/env node
import * as dev from './index.js';
const { run } = dev;

run().then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  }
);

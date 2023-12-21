import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'node:path';

import type { ResolvedPWAOptions } from './types.js';

export const getWorkerHash = ({ workerBuildDirectory, workerName }: ResolvedPWAOptions) => {
  const hash = createHash('md5');
  const workerPath = join(workerBuildDirectory, `${workerName}.js`);

  hash.update(readFileSync(workerPath, { encoding: 'utf-8' }));

  return hash.digest('hex');
};

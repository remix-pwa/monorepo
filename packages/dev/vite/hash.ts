import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'pathe';
import type { HMRBroadcaster } from 'vite';

import type { ResolvedPWAOptions } from './types.js';

export const getWorkerHash = ({ workerBuildDirectory, workerName }: ResolvedPWAOptions) => {
  const hash = createHash('md5');
  const workerPath = join(workerBuildDirectory, `${workerName}.js`);

  hash.update(readFileSync(workerPath, { encoding: 'utf-8' }));

  return hash.digest('hex');
};

export const compareHash = (hot: HMRBroadcaster, oldHash: string, newHash: string): boolean => {
  if (oldHash === newHash) {
    return false;
  }

  hot.send({
    type: 'custom',
    event: 'pwa:worker-reload',
    data: {
      oldHash,
      newHash,
    },
  });

  return true;
};

import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import type { WebSocketServer } from 'vite';

import type { ResolvedPWAOptions } from './types.js';

export const getWorkerHash = ({ workerBuildDirectory, workerName }: ResolvedPWAOptions) => {
  const hash = createHash('md5');
  const workerPath = join(workerBuildDirectory, `${workerName}.js`);

  hash.update(readFileSync(workerPath, { encoding: 'utf-8' }));

  return hash.digest('hex');
};

export const compareHash = (ws: WebSocketServer, oldHash: string, newHash: string) => {
  if (oldHash === newHash) {
    return;
  }

  ws.send({
    type: 'custom',
    event: 'pwa:worker-reload',
    data: {
      oldHash,
      newHash,
    },
  });
};

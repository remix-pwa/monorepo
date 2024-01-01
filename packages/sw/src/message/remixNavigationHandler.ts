import type { RemixCache } from '@remix-pwa/cache';
import { Storage } from '@remix-pwa/cache';

import { logger } from '../private/logger.js';
import type { MessageHandlerParams } from './message.js';
import { MessageHandler } from './message.js';

export interface RemixNavigationHandlerOptions extends MessageHandlerParams {
  dataCache: string | RemixCache;
  documentCache: string | RemixCache;
}

export class RemixNavigationHandler extends MessageHandler {
  dataCacheName: string | RemixCache;
  documentCacheName: string | RemixCache;

  constructor({ dataCache, documentCache, plugins, state }: RemixNavigationHandlerOptions) {
    super({ plugins, state });

    this.dataCacheName = dataCache;
    this.documentCacheName = documentCache;
    this._handleMessage = this._handleMessage.bind(this);
  }

  override async _handleMessage(event: ExtendableMessageEvent): Promise<void> {
    const { data } = event;
    let dataCache: RemixCache | string, documentCache: RemixCache | string;

    dataCache = this.dataCacheName;
    documentCache = this.documentCacheName;

    this.runPlugins('messageDidReceive', {
      event,
    });

    const cachePromises: Map<string, Promise<void>> = new Map();

    if (data.type === 'REMIX_NAVIGATION') {
      const { isMount, location } = data;
      const documentUrl = location.pathname + location.search + location.hash;

      if (typeof dataCache === 'string') {
        dataCache = Storage.open(dataCache);
      }

      if (typeof documentCache === 'string') {
        documentCache = Storage.open(documentCache);
      }

      const existingDocument = await Storage._match(documentUrl);

      if (!existingDocument || !isMount) {
        const response = await fetch(documentUrl);

        cachePromises.set(
          documentUrl,
          documentCache.put(documentUrl, response).catch(error => {
            if (process.env.NODE_ENV === 'development')
              logger.error(`Failed to cache document for ${documentUrl}:`, error);
          })
        );
      }
    }

    await Promise.all(cachePromises.values());
  }
}

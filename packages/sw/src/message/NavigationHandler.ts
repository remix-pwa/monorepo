import type { EnhancedCache } from '../cache/index.js';
import type { Logger } from '../logger/logger.js';
import { logger } from '../logger/logger.js';
import { MessageHandler } from './MessageHandler.js';

/**
 * The options the `NavigationHandler` expects.
 */
export type NavigationHandlerOptions = {
  /**
   * A list of regular expressions or strings to match against the current document URL.
   * If the current document URL does not match any of the patterns, the handler will not
   * handle the message.
   */
  allowList?: string[] | RegExp[];
  /**
   * The cache to use for handling the navigation event - caching the HTML responses.
   */
  cache: EnhancedCache;
  /**
   * A list of regular expressions or strings to match against the current document URL.
   * If the current document URL matches any of the patterns, the handler will not
   * handle the message.
   */
  denyList?: string[] | RegExp[];
  /**
   * The logger to use for logging messages. If this isn't provided,
   * the default logger will be used.
   *
   * @default logger
   */
  logger?: Logger;
};

/**
 * The `NavigationHandler` handles navigation events from the client and caches the HTML responses
 * as the user navigates between pages.
 */
export class NavigationHandler extends MessageHandler {
  private allowList: string[] | RegExp[];
  private denyList: string[] | RegExp[];
  private documentCache: EnhancedCache;
  private logger: Logger;

  constructor(options: NavigationHandlerOptions) {
    super('REMIX_NAVIGATION');

    this.allowList = options.allowList || [];
    this.denyList = options.denyList || [];
    this.documentCache = options.cache;
    this.logger = options.logger || logger;

    this.bind(this.handleNavigation.bind(this));
  }

  private async handleNavigation(event: any) {
    const { data } = event;
    const { isSsr, location } = data.payload;
    const documentUrl: string = location.pathname + location.search + location.hash;

    if (
      (this.allowList.length > 0 && !this.allowList.some(pattern => documentUrl.match(pattern))) ||
      (this.denyList.length > 0 && this.denyList.some(pattern => documentUrl.match(pattern)))
    ) {
      return;
    }

    try {
      const cacheMatch = await this.documentCache.match(documentUrl);

      // eslint-disable-next-line dot-notation
      if (!cacheMatch && this.documentCache['strategy'].constructor.name !== 'CacheOnly') {
        this.logger.debug(`Document request for ${documentUrl} not found in cache. Fetching from server...`);

        const response = await fetch(documentUrl).catch(error => {
          this.logger.error(`Error fetching document for ${documentUrl}:`, error);
        });

        if (!response) {
          return;
        }

        return await this.documentCache.addToCache(documentUrl, response.clone());
      }

      if (isSsr) {
        this.logger.setLogLevel('warn');
        this.logger.log(`Document request for ${documentUrl} handled.`);
        this.logger.setLogLevel('debug');

        // Todo: Handle loader events on document request
      }
    } catch (error) {
      this.logger.error(`Error handling document request for ${documentUrl}:`, error);
    }
  }
}

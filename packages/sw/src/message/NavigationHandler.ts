import { EnhancedCache } from '../cache/index.js';
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
   * A list of regular expressions or strings to match against the current document URL.
   * If the current document URL matches any of the patterns, the handler will not
   * handle the message.
   */
  denyList?: string[] | RegExp[];
  /**
   * The cache to use for handling the navigation event - caching the HTML responses.
   */
  documentCache: EnhancedCache | string;
};

/**
 * The `NavigationHandler` handles navigation events from the client and caches the HTML responses
 * as the user navigates between pages.
 */
export class NavigationHandler extends MessageHandler {
  private _allowList: string[] | RegExp[];
  private _denyList: string[] | RegExp[];
  private _documentCache: EnhancedCache;

  constructor(options: NavigationHandlerOptions) {
    super('REMIX_NAVIGATION');
    this._allowList = options.allowList || [];
    this._denyList = options.denyList || [];

    if (typeof options.documentCache === 'string') {
      this._documentCache = new EnhancedCache(options.documentCache);
    } else {
      this._documentCache = options.documentCache;
    }

    this.bind(this._handleMessage, this);
  }

  async _handleMessage(event: ExtendableMessageEvent) {
    const { data } = event;

    if (data.type === 'REMIX_NAVIGATION') {
      const { location } = data.payload;
      const documentUrl = location.pathname + location.search + location.hash;

      if (this._allowList.length > 0 && !this._allowList.some(pattern => documentUrl.match(pattern))) {
        return;
      }

      if (this._denyList.length > 0 && this._denyList.some(pattern => documentUrl.match(pattern))) {
        return;
      }

      await this._documentCache.handleRequest(documentUrl);
    }
  }
}

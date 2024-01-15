import { EnhancedCache } from '../cache/index.js';
import { MessageHandler } from './MessageHandler.js';

export type NavigationHandlerOptions = {
  allowList?: string[] | RegExp[];
  denyList?: string[] | RegExp[];
  documentCache: EnhancedCache | string;
};

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

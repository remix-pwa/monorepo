import { MessageHandler } from './MessageHandler.js';

/**
 * The `SkipWaitHandler` allows to manually skip the waiting phase of the service worker.
 */
export class SkipWaitHandler extends MessageHandler {
  constructor() {
    super('SKIP_WAITING');

    this.bind(this.skipWaiting.bind(this));
  }

  private async skipWaiting(event: any) {
    const { data } = event;

    if (data.type !== 'SKIP_WAITING') {
      return;
    }

    (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
  }
}

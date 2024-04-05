import { logger } from '../logger/logger.js';

interface MessageHandlerMap {
  [eventName: string]: (event: any) => Promise<void>;
}

export class MessageHandler {
  protected eventName: string;
  private static messageHandlers: MessageHandlerMap = {};

  constructor(eventName: string) {
    this.eventName = eventName;
  }

  protected bind(handler: (event: any) => Promise<void>) {
    MessageHandler.messageHandlers[this.eventName] = handler;
  }

  async handleMessage(event: ExtendableMessageEvent) {
    const { data } = event;

    if (typeof data === 'object' && data.type && MessageHandler.messageHandlers[data.type]) {
      try {
        await MessageHandler.messageHandlers[data.type](event);
      } catch (error) {
        logger.error(`Error handling message of type ${data.type}:`, error);
      }
    }
  }
}

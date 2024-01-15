export abstract class MessageHandler {
  private eventName: string;

  constructor(eventName: string) {
    // @ts-expect-error
    if (!self.__messageHandlers) {
      // @ts-expect-error
      self.__messageHandlers = new Map();
    }

    this.eventName = eventName;
  }

  protected bind(fn: (...args: any[]) => any, context: any) {
    // @ts-expect-error
    self.__messageHandlers.set(this.eventName, fn.bind(context));
  }

  async handleMessage(event: ExtendableMessageEvent) {
    const { data } = event;

    if (typeof data === 'object' && data.type) {
      // @ts-expect-error
      const handler = self.__messageHandlers.get(data.type);

      if (handler) {
        await handler(event);
      }
    }
  }

  protected abstract _handleMessage(event: ExtendableMessageEvent): Promise<void>;
}

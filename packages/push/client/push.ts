declare let self: ServiceWorkerGlobalScope;

export type PushManagerOptions = {
  handlePushEvent?: (event: PushEvent) => void;
  handleNotificationClick?: (event: NotificationEvent) => void;
  handleNotificationClose?: (event: NotificationEvent) => void;
  handleNotificationError?: (event: Event) => void;
};

export class PushManager {
  private _handlePushEvent: (event: PushEvent) => void;
  private _handleNotificationClick: (event: NotificationEvent) => void;
  private _handleNotificationClose: (event: NotificationEvent) => void;
  private _handleNotificationError: (event: Event) => void;

  constructor(options: PushManagerOptions) {
    this._handlePushEvent = options.handlePushEvent || this.handlePushEvent;
    this._handleNotificationClick = options.handleNotificationClick || this.handleNotificationClick;
    this._handleNotificationClose = options.handleNotificationClose || this.handleNotificationClose;
    this._handleNotificationError = options.handleNotificationError || this.handleNotificationError;

    this.registerListeners();
  }

  registerListeners() {
    self.addEventListener('push', this._handlePushEvent.bind(this));
    self.addEventListener('notificationclick', this._handleNotificationClick.bind(this));
    self.addEventListener('notificationclose', this._handleNotificationClose.bind(this));
    self.addEventListener('notificationerror', this._handleNotificationError.bind(this));
  }

  /**
   * Check if the client is focused
   *
   * @returns {Promise<boolean>}
   */
  async isClientFocused() {
    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    return clientList.some(client => client.focused);
  }

  /**
   * Post a message to the client.
   * @param message The message payload to send to the client
   * @param all Wether to send to all clients (windows). Would send to the first one found **only** if set to false.
   */
  async postMessageToClient(message: any, all = true) {
    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    if (all) {
      clientList.forEach(client => client.postMessage(message));
    } else {
      if (clientList.length > 0) {
        const client = clientList[0];
        client.postMessage(message);
      }
    }
  }

  handlePushEvent(event: PushEvent) {
    const func = async () => {
      let data;

      if (!event.data) return self.registration.showNotification('No data');

      try {
        data = event.data.json();
      } catch (e) {
        data = event.data.text();
      }

      if (typeof data === 'string') {
        return self.registration.showNotification(data);
      }

      const { title, ...rest } = data;

      return self.registration.showNotification(title, {
        ...rest,
      });
    };

    event.waitUntil(func());
  }

  handleNotificationClick(event: NotificationEvent) {
    event.notification.close();

    const func = async () => {
      const clientList = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      if (clientList.length > 0) {
        const client = clientList[0];
        client.focus();
      } else {
        self.clients.openWindow('/');
      }
    };

    event.waitUntil(func());
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  handleNotificationClose(_event: NotificationEvent) {}

  handleNotificationError(event: Event) {
    console.error('Notification error:', event);
  }

  test() {
    console.log('Test');
  }
}

import type { RequestOptions } from 'web-push';

export type VapidDetails = {
  publicKey: string;
  privateKey: string;
  subject?: string;
};

/**
 * Configuration for a Push Subscription. This can be obtained on the frontend by calling
 * `serviceWorkerRegistration.pushManager.subscribe()`.
 * The expected format is the same output as JSON.stringify'ing a `PushSubscription` in the browser.
 */
export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationObjectOptions extends NotificationOptions {
  body: string;
}

export type NotificationObject = {
  title: string;
  options: NotificationObjectOptions;
};

export type SendNotificationParams = {
  subscriptions: PushSubscription[];
  vapidDetails: VapidDetails;
  notification: NotificationObject;
  options: Omit<RequestOptions, 'vapidDetails'>;
};

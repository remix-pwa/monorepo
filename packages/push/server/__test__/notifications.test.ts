import { afterEach, describe, expect, test, vi } from 'vitest';
import webpush from 'web-push';

import { sendNotifications } from '../notifications.js';
import type { SendNotificationParams } from '../types.js';

vi.mock('web-push', () => ({
  default: {
    sendNotification: vi.fn(),
  },
}));

const subscription = {
  endpoint: 'https://push.example/sub-1',
  keys: {
    p256dh: 'p256dh-key',
    auth: 'auth-key',
  },
};

const params: SendNotificationParams = {
  notification: {
    title: 'Hello',
    options: {
      body: 'World',
    },
  },
  options: {},
  subscriptions: [subscription],
  vapidDetails: {
    publicKey: 'public-key',
    privateKey: 'private-key',
    subject: 'mailto:test@example.org',
  },
};

describe('sendNotifications', () => {
  afterEach(() => {
    vi.mocked(webpush.sendNotification).mockReset();
  });

  test('sends a stringified notification to each subscription', async () => {
    vi.mocked(webpush.sendNotification).mockResolvedValue({
      statusCode: 201,
      body: '',
      headers: {},
    });

    await sendNotifications(params);

    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
    expect(webpush.sendNotification).toHaveBeenCalledWith(subscription, JSON.stringify(params.notification), {
      vapidDetails: {
        publicKey: 'public-key',
        privateKey: 'private-key',
        subject: 'mailto:test@example.org',
      },
    });
  });

  test('rejects so callers can catch send failures', async () => {
    vi.mocked(webpush.sendNotification).mockRejectedValue(new Error('push failed'));

    await expect(sendNotifications(params)).rejects.toThrow('push failed');
  });
});

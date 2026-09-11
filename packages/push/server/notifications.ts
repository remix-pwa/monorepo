import webpush from 'web-push';

import type { SendNotificationParams } from './types.js';

export const sendNotifications = async ({
  notification,
  options = {},
  subscriptions,
  vapidDetails,
}: SendNotificationParams) => {
  const details = {
    ...vapidDetails,
    subject: vapidDetails.subject || 'mailto:user@example.org',
  };

  return Promise.all(
    subscriptions.map(subscription =>
      webpush.sendNotification(subscription, JSON.stringify(notification), { ...options, vapidDetails: details })
    )
  );
};

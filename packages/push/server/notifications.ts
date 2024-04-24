import * as webpush from 'web-push';

import type { SendNotificationParams } from './types.js';

export const sendNotifications = ({
  notification,
  options = {},
  subscriptions,
  vapidDetails,
}: SendNotificationParams) => {
  const details = {
    ...vapidDetails,
    subject: vapidDetails.subject || 'mailto:user@example.org',
  };

  subscriptions.forEach(subscription => {
    webpush
      .sendNotification(subscription, JSON.stringify(notification), { ...options, vapidDetails: details })
      .then((result: { statusCode: any }) => {
        return result;
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  });
};

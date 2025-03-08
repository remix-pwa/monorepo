import webpush from 'web-push';

import type { SendNotificationParams } from './types.js';

export interface NotificationResult {
  success: boolean;
  subscription: PushSubscription;
  statusCode?: number;
  error?: string;
}

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

  const results = await Promise.all(
    subscriptions.map(async subscription => {
      try {
        const result = await webpush.sendNotification(subscription, JSON.stringify(notification), {
          ...options,
          vapidDetails: details,
        });
        return {
          success: true,
          subscription,
          statusCode: result.statusCode,
        };
      } catch (error) {
        return {
          success: false,
          subscription,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  return results;
};

/**
 * Get the results of a notification send operation.
 * @param results - The results of the notification send operation.
 * @returns An object containing the successful, failed, and summary results of the notification send operation.
 *
 * **Example:**
 * ```ts
 * const results = await sendNotifications({ ... });
 * const { successful, failed, summary } = getNotificationResults(results);
 * ```
 */
export const getNotificationResults = (results: NotificationResult[]) => {
  return {
    successful: results.filter((r): r is NotificationResult & { success: true } => r.success),
    failed: results.filter((r): r is NotificationResult & { success: false } => !r.success),
    summary: {
      total: results.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
    },
  };
};

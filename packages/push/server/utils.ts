import { compare, genSalt, hash } from 'bcryptjs';

import type { PushSubscription } from './types.js';

/**
 * Utility to generate a subscription id on the fly.
 *
 * This method is great for sites with un-authenticated devices (users) that want to store subscriptions in a database.
 * @param subscription - The subscription object or a `JSON.strinfy`ed representation of the subscription.
 * @returns A hashed string of the keys.
 */
export const generateSubscriptionId = async (subscription: PushSubscription | string) => {
  const salt = await genSalt(10);

  if (typeof subscription === 'string') {
    return hash(subscription, salt);
  }

  return hash(JSON.stringify(subscription), salt);
};

/**
 * Utility function to compare a subscription with a subscription hash.
 *
 * @param subscription - The subscription object or a `JSON.strinfy`ed representation of the subscription.
 * @param hash - The hash to compare the keys against.
 * @returns A boolean indicating if the keys match the hash.
 */
export const compareSubscriptionId = async (subscription: PushSubscription | string, hash: string) => {
  if (typeof subscription === 'string') {
    return compare(subscription, hash);
  }

  return compare(JSON.stringify(subscription), hash);
};

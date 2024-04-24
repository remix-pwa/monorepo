import { compare, genSalt, hash } from 'bcryptjs';

/**
 * Utility to generate a subscription id on the fly.
 *
 * This method is great for sites with un-authenticated devices (users) that want to store subscriptions in a database.
 * @param keys - The keys from the subscription object or a `JSON.strinfy`ed representation of the keys.
 * @returns A hashed string of the keys.
 */
export const generateSubscriptionId = async (keys: { p256dh: string; auth: string } | string) => {
  const salt = await genSalt(10);

  if (typeof keys === 'string') {
    return hash(keys, salt);
  }

  return hash(JSON.stringify(keys), salt);
};

/**
 * Utility function to compare a subscription with a subscription hash.
 *
 * @param keys - The keys from the subscription object or a `JSON.strinfy`ed representation of the keys.
 * @param hash - The hash to compare the keys against.
 * @returns A boolean indicating if the keys match the hash.
 */
export const compareSubscriptionId = async (keys: { p256dh: string; auth: string } | string, hash: string) => {
  if (typeof keys === 'string') {
    return compare(keys, hash);
  }

  return compare(JSON.stringify(keys), hash);
};

import type { PushSubscription } from './types.js';

/**
 * A general subscription storage provider you can implement. This can be used as a guideline to store
 * subscriptions in a database, in memory, or anywhere else you'd like.
 */
export interface SubscriptionStorageProvider {
  storeSubscription(subscription: PushSubscription, id: string): Promise<void>;
  deleteSubscription(subscription: PushSubscription, id: string): Promise<void>;
  getSubscriptions(filters: unknown): Promise<PushSubscription[]>;
  getSubscription(id: string): Promise<PushSubscription>;
  hasSubscription(subscription: PushSubscription, id: string): Promise<boolean>;
}

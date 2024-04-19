import type { PushSubscription } from './types.js';

export interface SubscriptionStorageProvider {
  storeSubscription(subscription: PushSubscription, id: string): Promise<void>;
  deleteSubscription(subscription: PushSubscription, id: string): Promise<void>;
  getSubscriptions(filters: unknown): Promise<PushSubscription[]>;
  getSubscription(id: string): Promise<PushSubscription>;
  hasSubscription(subscription: PushSubscription, id: string): Promise<boolean>;
}

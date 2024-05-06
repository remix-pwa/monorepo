/*
  Copyright 2018 Google LLC

  Attribution: The bloc of this source code is derived from the
  `workbox-background-sync` plugin, authored by Jeff Posnick and Google Workbox team;
  And also `serwist` by Jeff Posnick and the Serwist team.

  The original source code can be found at:
  https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-background-sync/src/Queue.ts
*/

import type { Logger } from '@remix-pwa/sw';
import { logger } from '@remix-pwa/sw';

import type { BackgroundSyncQueueStoreEntry, UnidentifiedQueueStoreEntry } from './db.js';
import { StorableRequest } from './request.js';
import { BackgroundSyncQueueStore } from './store.js';

// See https://github.com/GoogleChrome/workbox/issues/2946
interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager;
  }

  interface SyncEvent extends ExtendableEvent {
    readonly lastChance: boolean;
    readonly tag: string;
  }

  interface ServiceWorkerGlobalScopeEventMap {
    sync: SyncEvent;
  }
}

// Give TypeScript the correct global.
declare const self: ServiceWorkerGlobalScope;

interface OnSyncCallbackOptions {
  // eslint-disable-next-line no-use-before-define
  queue: BackgroundSyncQueue;
}

type OnSyncCallback = (options: OnSyncCallbackOptions) => void | Promise<void>;

export interface BackgroundSyncQueueOptions {
  /**
   * The amount of time (in minutes) a request may be retried. After this amount
   * of time has passed, the request will be deleted from the queue.
   *
   * @default 60 * 24 * 7
   */
  maxRetentionTime?: number;
  /**
   * A function that gets invoked whenever the 'sync' event fires. The function
   * is invoked with an object containing the `queue` property (referencing this
   * instance), and you can use the callback to customize the replay behavior of
   * the queue. When not set, the `replayRequests()` method is called.
   *
   * Note: if the replay fails after a sync event, make sure you throw an error,
   * so the browser knows to retry the sync event later.
   */
  onSync?: OnSyncCallback;
  /**
   * Custom this._logger to use for logging background sync events.
   *
   * Defaults to `@remix-pwa/sw` default this._logger.
   */
  logger?: Logger;
}

export interface BackgroundSyncQueueEntry {
  /**
   * The request to store in the queue.
   */
  request: Request;
  /**
   * The timestamp (Epoch time in milliseconds) when the request was first added
   * to the queue. This is used along with `maxRetentionTime` to remove outdated
   * requests. In general you don't need to set this value, as it's automatically
   * set for you (defaulting to `Date.now()`), but you can update it if you don't
   * want particular requests to expire.
   */
  timestamp?: number;
  /**
   * Any metadata you want associated with the stored request. When requests are
   * replayed you'll have access to this metadata object in case you need to modify
   * the request beforehand.
   */
  metadata?: Record<string, unknown>;
}

const TAG_PREFIX = 'remix-pwa-bg-sync';
const MAX_RETENTION_TIME = 60 * 24 * 7; // 7 days

const queueNames = new Set<string>();

const getFriendlyURL = (url: URL | string): string => {
  const urlObj = new URL(String(url), location.href);
  // See https://github.com/GoogleChrome/workbox/issues/2323
  // We want to include everything, except for the origin if it's same-origin.
  return urlObj.href.replace(new RegExp(`^${location.origin}`), '');
};

/**
 * Converts a QueueStore entry into the format exposed by Queue. This entails
 * converting the request data into a real request and omitting the `id` and
 * `queueName` properties.
 *
 * @param queueStoreEntry
 * @returns
 * @private
 */
const convertEntry = (queueStoreEntry: UnidentifiedQueueStoreEntry): BackgroundSyncQueueEntry => {
  const queueEntry: BackgroundSyncQueueEntry = {
    request: new StorableRequest(queueStoreEntry.requestData).toRequest(),
    timestamp: queueStoreEntry.timestamp,
  };
  if (queueStoreEntry.metadata) {
    queueEntry.metadata = queueStoreEntry.metadata;
  }
  return queueEntry;
};

/**
 * A class to manage storing failed requests in IndexedDB and retrying them
 * later. All parts of the storing and replaying process are observable via
 * callbacks.
 */
export class BackgroundSyncQueue {
  private readonly _name: string;
  private readonly _logger: Logger;
  private readonly _onSync: OnSyncCallback;
  private readonly _maxRetentionTime: number;
  private readonly _queueStore: BackgroundSyncQueueStore;
  private _syncInProgress = false;
  private _requestsAddedDuringSync = false;

  /**
   * Creates an instance of Queue with the given options
   *
   * @param name The unique name for this queue. This name must be
   * unique as it's used to register sync events and store requests
   * in IndexedDB specific to this instance. An error will be thrown if
   * a duplicate name is detected.
   * @param options
   */
  constructor(name: string, { logger: customLogger, maxRetentionTime, onSync }: BackgroundSyncQueueOptions = {}) {
    // Ensure the store name is not already being used
    if (queueNames.has(name)) {
      throw new Error(`A queue with name '${name}' already exists. All queues must have unique names`);
    }

    queueNames.add(name);

    this._name = name;
    this._logger = customLogger || logger;
    this._onSync = onSync || this.replayRequests;
    this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
    this._queueStore = new BackgroundSyncQueueStore(this._name);

    this._addSyncListener();
  }

  /**
   * @returns
   */
  get name(): string {
    return this._name;
  }

  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the end of the queue.
   *
   * @param entry
   */
  async pushRequest(entry: BackgroundSyncQueueEntry): Promise<void> {
    await this._addRequest(entry, 'push');
  }

  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the beginning of the queue.
   *
   * @param entry
   */
  async unshiftRequest(entry: BackgroundSyncQueueEntry): Promise<void> {
    await this._addRequest(entry, 'unshift');
  }

  /**
   * Removes and returns the last request in the queue (along with its
   * timestamp and any metadata).
   *
   * @returns
   */
  async popRequest(): Promise<BackgroundSyncQueueEntry | undefined> {
    return this._removeRequest('pop');
  }

  /**
   * Removes and returns the first request in the queue (along with its
   * timestamp and any metadata).
   *
   * @returns
   */
  async shiftRequest(): Promise<BackgroundSyncQueueEntry | undefined> {
    return this._removeRequest('shift');
  }

  /**
   * Returns all the entries that have not expired (per `maxRetentionTime`).
   * Any expired entries are removed from the queue.
   *
   * @returns
   */
  async getAll(): Promise<BackgroundSyncQueueEntry[]> {
    const allEntries = await this._queueStore.getAll();
    const now = Date.now();

    const unexpiredEntries = [];
    for (const entry of allEntries) {
      // Ignore requests older than maxRetentionTime. Call this function
      // recursively until an unexpired request is found.
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1000;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        await this._queueStore.deleteEntry(entry.id);
      } else {
        unexpiredEntries.push(convertEntry(entry));
      }
    }

    return unexpiredEntries;
  }

  /**
   * Returns the number of entries present in the queue.
   * Note that expired entries (per `maxRetentionTime`) are also included in this count.
   *
   * @returns
   */
  async size(): Promise<number> {
    return await this._queueStore.size();
  }

  /**
   * Adds the entry to the QueueStore and registers for a sync event.
   *
   * @param entry
   * @param operation
   * @private
   */
  async _addRequest(
    { metadata, request, timestamp = Date.now() }: BackgroundSyncQueueEntry,
    operation: 'push' | 'unshift'
  ): Promise<void> {
    const storableRequest = await StorableRequest.fromRequest(request.clone());
    const entry: UnidentifiedQueueStoreEntry = {
      requestData: storableRequest.toObject(),
      timestamp,
    };

    // Only include metadata if it's present.
    if (metadata) {
      entry.metadata = metadata;
    }

    switch (operation) {
      case 'push':
        await this._queueStore.pushEntry(entry);
        break;
      case 'unshift':
        await this._queueStore.unshiftEntry(entry);
        break;
    }

    this._logger.log(
      `Request for '${getFriendlyURL(request.url)}' has ` + `been added to background sync queue '${this._name}'.`
    );

    // Don't register for a sync if we're in the middle of a sync. Instead,
    // we wait until the sync is complete and call register if
    // `this._requestsAddedDuringSync` is true.
    if (this._syncInProgress) {
      this._requestsAddedDuringSync = true;
    } else {
      await this.registerSync();
    }
  }

  /**
   * Removes and returns the first or last (depending on `operation`) entry
   * from the QueueStore that's not older than the `maxRetentionTime`.
   *
   * @param operation
   * @returns
   * @private
   */
  async _removeRequest(operation: 'pop' | 'shift'): Promise<BackgroundSyncQueueEntry | undefined> {
    const now = Date.now();
    let entry: BackgroundSyncQueueStoreEntry | undefined;
    switch (operation) {
      case 'pop':
        entry = await this._queueStore.popEntry();
        break;
      case 'shift':
        entry = await this._queueStore.shiftEntry();
        break;
    }

    if (entry) {
      // Ignore requests older than maxRetentionTime. Call this function
      // recursively until an unexpired request is found.
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1000;
      if (now - entry.timestamp > maxRetentionTimeInMs) {
        return this._removeRequest(operation);
      }

      return convertEntry(entry);
    }

    return undefined;
  }

  /**
   * Loops through each request in the queue and attempts to re-fetch it.
   * If any request fails to re-fetch, it's put back in the same position in
   * the queue (which registers a retry for the next sync event).
   */
  async replayRequests(): Promise<void> {
    let entry: BackgroundSyncQueueEntry | undefined;
    while ((entry = await this.shiftRequest())) {
      try {
        await fetch(entry.request.clone());

        this._logger.log(
          `Request for '${getFriendlyURL(entry.request.url)}' ` + `has been replayed in queue '${this._name}'`
        );
      } catch (error) {
        await this.unshiftRequest(entry);

        this._logger.log(
          `Request for '${getFriendlyURL(entry.request.url)}' ` +
            `failed to replay, putting it back in queue '${this._name}'`
        );
        throw new Error(`Replaying the background sync queue '${this._name}' failed.`);
      }
    }

    this._logger.log(`All requests in queue '${this.name}' have successfully replayed; the queue is now empty!`);
  }

  /**
   * Registers a sync event with a tag unique to this instance.
   */
  async registerSync(): Promise<void> {
    // See https://github.com/GoogleChrome/workbox/issues/2393
    if ('sync' in self.registration) {
      try {
        await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
      } catch (err) {
        // This means the registration failed for some reason, possibly due to
        // the user disabling it.
        this._logger.warn(`Unable to register sync event for '${this._name}'.`, err);
      }
    }
  }

  /**
   * In sync-supporting browsers, this adds a listener for the sync event.
   * In non-sync-supporting browsers, or if _forceSyncFallback is true, this
   * will retry the queue on service worker startup.
   *
   * @private
   */
  private _addSyncListener() {
    if ('sync' in self.registration) {
      self.addEventListener('sync', (event: SyncEvent) => {
        if (event.tag === `${TAG_PREFIX}:${this._name}`) {
          this._logger.log(`Background sync for tag '${event.tag}' has been received`);

          const syncComplete = async () => {
            this._syncInProgress = true;

            let syncError: Error | undefined;
            try {
              await this._onSync({ queue: this });
            } catch (error) {
              if (error instanceof Error) {
                syncError = error;

                // Rethrow the error. Note: the logic in the finally clause
                // will run before this gets rethrown.
                throw syncError;
              }
            } finally {
              // New items may have been added to the queue during the sync,
              // so we need to register for a new sync if that's happened...
              // Unless there was an error during the sync, in which
              // case the browser will automatically retry later, as long
              // as `event.lastChance` is not true.
              if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) {
                await this.registerSync();
              }

              this._syncInProgress = false;
              this._requestsAddedDuringSync = false;
            }
          };
          event.waitUntil(syncComplete());
        }
      });
    } else {
      this._logger.log('Background sync not supported in this browser. Would retry on service worker startup.');

      // eslint-disable-next-line no-void
      void this._onSync({ queue: this });
    }
  }

  /**
   * Returns the set of queue names. This is primarily used to reset the list
   * of queue names in tests.
   *
   * @returns
   * @private
   */
  static get _queueNames(): Set<string> {
    return queueNames;
  }
}

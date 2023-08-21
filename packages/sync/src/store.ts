/*
  Copyright 2018 Google LLC

  Attribution: The bloc of this source code is derived from the
  `workbox-background-sync` plugin, authored by Jeff Posnick and Google Workbox team.
  We simply replicated the main logic of the plugin and built it natively with Remix PWA.

  The original source code can be found at:
  https://github.com/GoogleChrome/workbox/blob/v7/packages/workbox-background-sync/src/lib/QueueStore.ts
*/

import type { QueueStoreEntry, UnidentifiedQueueStoreEntry } from './db.js';
import { QueueDb } from './db.js';

/**
 * A class to manage storing requests from a Queue in IndexedDB,
 * indexed by their queue name for easier access.
 *
 * Most developers will not need to access this class directly;
 * it is exposed for advanced use cases.
 */
export class QueueStore {
  private readonly _queueName: string;
  private readonly _queueDb: QueueDb;

  /**
   * Associates this instance with a Queue instance, so entries added can be
   * identified by their queue name.
   *
   * @param {string} queueName
   */
  constructor(queueName: string) {
    this._queueName = queueName;
    this._queueDb = new QueueDb();
  }

  /**
   * Append an entry last in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async pushEntry(entry: UnidentifiedQueueStoreEntry): Promise<void> {
    // Don't specify an ID since one is automatically generated.
    delete entry.id;
    entry.queueName = this._queueName;

    await this._queueDb.addEntry(entry);
  }

  /**
   * Prepend an entry first in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async unshiftEntry(entry: UnidentifiedQueueStoreEntry): Promise<void> {
    const firstId = await this._queueDb.getFirstEntryId();

    if (firstId) {
      // Pick an ID one less than the lowest ID in the object store.
      entry.id = firstId - 1;
    } else {
      // Otherwise let the auto-incrementor assign the ID.
      delete entry.id;
    }
    entry.queueName = this._queueName;

    await this._queueDb.addEntry(entry);
  }

  /**
   * Removes and returns the last entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async popEntry(): Promise<QueueStoreEntry | undefined> {
    return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));
  }

  /**
   * Removes and returns the first entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async shiftEntry(): Promise<QueueStoreEntry | undefined> {
    return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));
  }

  /**
   * Returns all entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~getAll}
   * @return {Promise<Array<Object>>}
   */
  async getAll(): Promise<QueueStoreEntry[]> {
    return await this._queueDb.getAllEntriesByQueueName(this._queueName);
  }

  /**
   * Returns the number of entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~size}
   * @return {Promise<number>}
   */
  async size(): Promise<number> {
    return await this._queueDb.getEntryCountByQueueName(this._queueName);
  }

  /**
   * Deletes the entry for the given ID.
   *
   * WARNING: this method does not ensure the deleted entry belongs to this
   * queue (i.e. matches the `queueName`). But this limitation is acceptable
   * as this class is not publicly exposed. An additional check would make
   * this method slower than it needs to be.
   *
   * @param {number} id
   */
  async deleteEntry(id: number): Promise<void> {
    await this._queueDb.deleteEntry(id);
  }

  /**
   * Removes and returns the first or last entry in the queue (based on the
   * `direction` argument) matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   * @private
   */
  async _removeEntry(entry?: QueueStoreEntry): Promise<QueueStoreEntry | undefined> {
    if (entry) {
      await this.deleteEntry(entry.id);
    }
    return entry;
  }
}

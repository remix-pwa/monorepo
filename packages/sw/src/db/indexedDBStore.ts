import type { IDBPDatabase } from 'idb';
import { openDB } from 'idb';

export type StoreOptions = {
  /**
   * The name of the indexedDB store
   */
  name: string;
};

export type StoreAPI = {
  /**
   * Get the indexedDB store
   */
  getDB: () => Promise<IDBPDatabase>;
  /**
   * Get a value from the indexedDB store
   */
  get: (key: string) => Promise<any>;
  /**
   * Set a value in the indexedDB store
   */
  set: (key: string, val: any) => Promise<IDBValidKey>;
  /**
   * Delete a value from the indexedDB store
   */
  del: (key: string) => Promise<void>;
  /**
   * Clear the indexedDB store
   */
  clear: () => Promise<void>;
  /**
   * Get all the keys in the indexedDB store
   */
  keys: () => Promise<IDBValidKey[]>;
};

/**
 * Create and interact with indexedDB stores from within your service worker
 */
export const indexedDBStore = ({ name }: StoreOptions): StoreAPI => {
  const db = openDB(name, 2, {
    upgrade(db) {
      db.createObjectStore(name);
    },
  });

  const getDB = async () => {
    return db;
  };

  const get = async (key: string) => {
    return (await db).get(name, key);
  };

  const set = async (key: string, val: any) => {
    return (await db).put(name, val, key);
  };

  const del = async (key: string) => {
    return (await db).delete(name, key);
  };

  const clear = async () => {
    return (await db).clear(name);
  };

  const keys = async () => {
    return (await db).getAllKeys(name);
  };

  return {
    getDB,
    get,
    set,
    del,
    clear,
    keys,
  };
};

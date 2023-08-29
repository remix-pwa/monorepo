import { Queue } from './queue.js';

class SyncQueue {
  public static readonly queues: Map<string, Queue> = new Map();

  static createQueue(name: string): Queue {
    if (this.queues.has(name)) {
      throw new Error(`Queue "${name}" already exists`);
    }

    const _q = new Queue(name);
    this.queues.set(name, _q);
    return _q;
  }

  static getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  static removeQueue(name: string): void {
    this.queues.delete(name);
  }

  static async getQueueNames(): Promise<string[]> {
    return Array.from(this.queues.keys());
  }

  static async getQueueSizes(): Promise<Map<string, number>> {
    const sizes = new Map<string, number>();
    for (const [name, queue] of this.queues) {
      sizes.set(name, await queue.size());
    }
    return sizes;
  }

  /* WIP */ private async getQueueByTag(tag: string): Promise<Queue | undefined> {
    for (const [name, queue] of new Map()) {
      if (name === tag) {
        return queue;
      }
    }

    return undefined;
  }
}

// Todo: Integrate a Maximum Retention Time (MRT) feature
export type QueueToServerOptions = {
  /**
   * The name of the queue to be used. Use this to group requests together to all be retried
   * later on.
   */
  name: string;
  // Suppressing this for now as there's no way I
  // know of to access the __windowManifest from remix here (worker thread)
  /**
   * The request to be queued. By default, this is the current route's request.
   */
  request: Request /* | RegExp */;
  // manifest?: AssetsManifest;
};

/**
 * This function is similar to `fetchFromServer` in that it would fetch a request
 * from it's respective server action, but instead of just throwing an error if it fails,
 * it would queue the request to be retried later on.
 *
 * @param {QueueToServerOptions} options
 */
export const queueToServer = ({ name, request }: QueueToServerOptions): void => {
  let queue: Queue;

  try {
    queue = SyncQueue.createQueue(name);
  } catch (e) {
    queue = SyncQueue.getQueue(name) as unknown as Queue;
  }

  queue.pushRequest({ request: request as Request });
};

import type { StrategyOptions, StrategyResponse } from './types.js';
import { isHttpRequest } from './utils.js';

export interface NetworkOnlyStrategyOptions
  extends Omit<StrategyOptions, 'cacheOptions' | 'cache' | 'cacheQueryOptions'> {
  /**
   * The maximum number of milliseconds to wait before considering the request to have timed out.
   * In seconds.
   *
   * Defaults to: `10`
   */
  networkTimeoutSeconds?: number;
  /**
   * A callback that will be called when the network request fails before
   * an attempt is made to retrieve from the cache. This is useful for stuffs like
   * logging errors and queueing requests.
   *
   * Defaults to `undefined`
   */
  fetchDidFail?: (() => void | (() => Promise<void>))[] | undefined;
  /**
   * A callback that will be called when the network request succeeds.
   *
   * Defaults to `undefined`
   */
  fetchDidSucceed?: (() => void | (() => Promise<void>))[] | undefined;
}

export const networkOnly = ({
  fetchDidFail = undefined,
  fetchDidSucceed = undefined,
  networkTimeoutSeconds = 10,
}: NetworkOnlyStrategyOptions): StrategyResponse => {
  return async (request: Request | URL) => {
    if (!isHttpRequest(request)) {
      return new Response('Not a HTTP request', { status: 403 });
    }

    try {
      // Much tamer version of the timeout functionality
      // const timeoutPromise = networkTimeoutSeconds !== Infinity ? timeout(networkTimeoutSeconds * 1000) : null;

      const timeoutPromise =
        networkTimeoutSeconds !== Infinity
          ? new Promise<Response>((_resolve, reject) => {
              setTimeout(() => {
                reject(new Error(`Network timed out after ${networkTimeoutSeconds} seconds`));
              }, networkTimeoutSeconds * 1000);
            })
          : null;

      const response = timeoutPromise ? await Promise.race([fetch(request), timeoutPromise]) : await fetch(request);

      if (response) {
        if (fetchDidSucceed) {
          await Promise.all(fetchDidSucceed.map(cb => cb()));
        }

        return response.clone();
      }

      // Re-thrown error to be caught by `catch` block
      throw new Error('Network request failed');
    } catch (error) {
      if (fetchDidFail) {
        await Promise.all(fetchDidFail.map(cb => cb()));
      }

      return new Response(JSON.stringify({ message: 'Network Error. Failed to fetch' }), {
        status: 500,
      });
    }
  };
};

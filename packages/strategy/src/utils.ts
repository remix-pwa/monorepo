/**
 * Returns a promise that resolves and the passed number of milliseconds.
 * This utility is an async/await-friendly version of `setTimeout`.
 *
 * @param {number} ms
 * @return {Promise}
 * @private
 */
export function timeout(ms: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if the passed request is an HTTP request.
 *
 * @param {Request | URL} request
 * @return {boolean}
 * @private
 */
export const isHttpRequest = (request: Request | URL): boolean => {
  if (request instanceof Request) {
    return request.url.startsWith('http');
  }

  return request.toString().startsWith('http');
};

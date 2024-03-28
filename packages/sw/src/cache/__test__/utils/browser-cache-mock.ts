import * as utils from './cache-mock-utils.js';

/** An in-memory implementation of the browser cache that can be used to test caching strategies in a node environment. */
class CacheMock {
  cache: Map<Request, Response>;

  constructor() {
    this.cache = new Map();
  }

  private get({ url }: Request): Response | undefined {
    for (const [key, value] of this.cache.entries()) {
      if (key.url === url) {
        return value;
      }
    }
  }

  private getAll({ url }: Request): Response[] {
    const matches: Response[] = [];
    for (const [key, value] of this.cache.entries()) {
      const regex = new RegExp(url, 'i');
      if (key.url.match(regex)) {
        matches.push(value);
      }
    }
    return matches;
  }

  private set(request: Request, response: Response): void {
    let relevantRequest = request;

    for (const [key] of this.cache.entries()) {
      if (key.url === request.url) {
        relevantRequest = key;
        break;
      }
    }
    this.cache = this.cache.set(relevantRequest, response);
  }

  /**
   * Takes a URL, retrieves it and adds the resulting response object to the given cache. This is functionally equivalent to calling fetch(), then using put() to add the results to the cache.
   * @param {RequestInfo} request The request to add to the Cache
   * @returns {Promise<void>}
   */
  async add(request: RequestInfo): Promise<void> {
    if (utils.isRequest(request) || utils.isString(request)) {
      const response = await utils.fitch(request);
      this.cache.set(new Request(request), response);
    } else {
      throw utils.invalidRequestParamError();
    }
  }

  /**
   * Takes an array of URLs, retrieves them, and adds the resulting response objects to the given cache.
   * @param {Array<RequestInfo>} requests An array of requests to add to the cache
   * @returns {Promise<void>}
   */
  async addAll(requests: RequestInfo[]): Promise<void> {
    for (const request of requests) {
      await this.add(request);
    }
  }

  /**
   * Finds the Cache entry whose key is the request, returning a Promise that resolves to true if a matching Cache entry is found and deleted. If no Cache entry is found, the promise resolves to false.
   * @param {RequestInfo} request The request to search for
   * @param {CacheQueryOptions} options Additional options to be condsidered when searching
   * @returns {Promise<boolean>} A boolean value indicating whether the a key was deleted from the cache
   */
  async delete(request: RequestInfo, options?: CacheQueryOptions): Promise<boolean> {
    const requestUrl = this.getRequestUrl(request, options);

    const key = (await this.keys()).find(({ url }) => url === requestUrl);

    if (key) {
      return this.cache.delete(key);
    }
    return false;
  }

  private getRequestUrl(request: RequestInfo, options?: CacheQueryOptions): string {
    let requestUrl = utils.getRequestUrl(request);

    if (options && options.ignoreSearch) {
      requestUrl = utils.removeSearchParams(requestUrl);
    }
    return requestUrl;
  }

  /**
   * Returns a Promise that resolves to an array of Cache keys.
   * @param {RequestInfo} request The request to search for
   * @param {CacheQueryOptions} options Additional options to be condsidered when searching
   * @returns {Promise<ReadonlyArray<Request>>} A readonly array of matching cache keys
   */
  async keys(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Request>> {
    const keys = Array.from(this.cache.keys());

    if (request || (request && options && options.ignoreSearch)) {
      const requestUrl = this.getRequestUrl(request, options);
      const regex = new RegExp(requestUrl, 'i');
      return keys.filter(({ url }) => url.match(regex));
    }

    return keys;
  }

  /**
   * Returns a Promise that resolves to the response associated with the first matching request in the Cache object.
   * @param {RequestInfo} request The request to search for
   * @param {CacheQueryOptions} options Additional options to be condsidered when searching
   * @returns {Promise<Response | undefined>} The match found in the cache, if anything has been found
   */
  async match(request: RequestInfo, options?: CacheQueryOptions): Promise<Response | undefined> {
    const req = this.validateRequest(request, options);
    return this.get(req);
  }

  private validateRequest(request: RequestInfo, options?: CacheQueryOptions): Request {
    let req = utils.validateRequest(request);
    if (options && options.ignoreSearch) {
      req = new Request(utils.removeSearchParams(req.url));
    }
    return req;
  }

  /**
   * Returns a Promise that resolves to an array of all matching requests in the Cache object.
   * @param {RequestInfo} request The request key to match against
   * @param {CacheQueryOptions} options Additional options to be condsidered when searching
   * @returns {Promise<ReadonlyArray<Response>>} A readonly array of matching cache responses
   */
  async matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<ReadonlyArray<Response>> {
    if (request) {
      const req = this.validateRequest(request, options);
      return this.getAll(req);
    } else {
      return Array.from(this.cache.values());
    }
  }

  /**
   * Takes both a request and its response and adds it to the given cache.
   * @param {RequestInfo} request The request key to add to the cache
   * @param {Response} response The response value to add to the cache key
   * @returns {Promise<void>}
   */
  async put(request: RequestInfo, response: Response): Promise<void> {
    const newRequest = utils.validateRequest(request);
    this.set(newRequest, response);
  }
}

export default CacheMock;

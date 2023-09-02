/**
 * Automatically check the method of a request against a list of methods.
 *
 * @param request The request to check.
 * @param methods The list of methods to check against.
 * @returns Whether the request method is in the list of methods.
 */
export function isMethod(request: Request, methods: string[]): boolean {
  return methods.includes(request.method.toLowerCase());
}

/**
 * Default checker for asset requests. Determine wether a request is for assets or not.
 *
 * @param request The request to check.
 * @param assetUrls The list of asset urls to check against. Defaults to: `['/build/', '/icons']`
 * @returns Whether the request is for assets or not.
 */
export function isAssetRequest(request: Request, assetUrls: string[] = ['/build/', '/icons']): boolean {
  return isMethod(request, ['get']) && assetUrls.some(publicPath => request.url.includes(publicPath));
}

/**
 * Default checker for loader requests. Determine wether a request is for loader or not.
 *
 * @param request The request to check.
 * @returns {string | false | null} Whether the request is for loader or not.
 */
export function isLoaderRequest(request: Request): string | false | null {
  const url = new URL(request.url);
  return isMethod(request, ['get']) && url.searchParams.get('_data');
}

export type MatchResponse = 'loader' | 'document' | 'asset' | null;

/**
 * Default matcher type for requests. Determine the type of a request.
 *
 * @param request The request to check.
 * @param assetUrls The list of asset urls to check against.
 * @returns {string | false | null} The type of the request.
 */
export type MatchRequest = (request: Request, assetUrls?: string[]) => MatchResponse;

export const matchRequest: MatchRequest = (request: Request, assetUrls = ['/build/', '/icons']): MatchResponse => {
  if (isAssetRequest(request, assetUrls)) {
    return 'asset';
  } else if (isLoaderRequest(request)) {
    return 'loader';
  } else {
    return null;
  }
};

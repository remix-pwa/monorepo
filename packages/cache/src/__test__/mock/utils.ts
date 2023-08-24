export function isRequest(request: RequestInfo): boolean {
  return request instanceof Request;
}

export function isString(request: RequestInfo): boolean {
  return typeof request === 'string';
}

export function invalidRequestParamError(): TypeError {
  return new TypeError('request must be of type Request or string');
}

export function getRequestUrl(request: RequestInfo): string {
  if (request instanceof Request) {
    return request.url;
  } else if (isString(request)) {
    return request;
  }
  throw invalidRequestParamError();
}

export function validateRequest(request: RequestInfo): Request {
  if (request instanceof Request) {
    return request;
  } else if (isString(request)) {
    return new Request(request);
  }
  throw invalidRequestParamError();
}

export function removeSearchParams(url: string): string {
  return url.split('?')[0];
}

export function fitch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}

import { atob } from 'js-base64';

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(...headers: Array<ResponseInit['headers'] | null | undefined>) {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      merged.set(key, value);
    }
  }
  return merged;
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(...headers: Array<ResponseInit['headers'] | null | undefined>) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

/**
 * Omit a key from an object
 */
export function omit(key: string, obj: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

function assertString(value: string) {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}

function base64UrlToBase64(base64url: string) {
  return base64url.replaceAll('-', '+').replaceAll('_', '/');
}

export function base64ToUint8Array(base64String: string) {
  assertString(base64String);
  return Uint8Array.from(atob(base64UrlToBase64(base64String)), x => x.codePointAt(0) as number);
}

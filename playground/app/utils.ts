import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Custom classnames function that merges tailwind classes
 * @param inputs the classes to merge
 * @returns a string of merged classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a global type to extend Window
declare global {
  interface Window {
    __mockFetchHandlers: Map<string, () => Promise<Response>>;
  }
}

/**
 * Creates a higher-order function that mocks fetch for a specific request URL.
 * 
 * @param {string} requestUrl - The URL of the request to mock.
 * @param {() => Promise<Response>} mockedLoader - A function that returns a mocked Response.
 * @returns {(fn: Function) => (...args: any[]) => Promise<any>} A higher-order function that wraps the original function with mocked fetch.
 */
export function createMockFetchWrapper(requestUrl: string, mockedLoader: () => Promise<Response>): (fn: Function) => (...args: any[]) => Promise<any> {
  return function withMockedFetch(fn: Function): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      if (typeof window === 'undefined') {
        return;
      }

      // Initialize the mock handlers map if it doesn't exist
      if (!window.__mockFetchHandlers) {
        window.__mockFetchHandlers = new Map();
      }

      // Add this mock to the handlers
      window.__mockFetchHandlers.set(requestUrl, mockedLoader);

      const originalFetch = window.fetch;

      if (window.fetch === originalFetch) {
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
          const request = new Request(input, init);
          const pathname = new URL(request.url).pathname;

          if (window.__mockFetchHandlers.has(pathname)) {
            return window.__mockFetchHandlers.get(pathname)!();
          }

          return originalFetch(input, init);
        };
      }

      try {
        return await fn(...args);
      } finally {
        // Remove this mock from the handlers
        window.__mockFetchHandlers.delete(requestUrl);

        // If there are no more mocks, restore the original fetch
        if (window.__mockFetchHandlers.size === 0) {
          window.fetch = originalFetch;
        }
      }
    };
  };
}
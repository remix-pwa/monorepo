/// <reference lib="WebWorker" />

import { logger } from '../../packages/sw/src/logger/logger';

declare let self: ServiceWorkerGlobalScope;

/**
 * The load context works same as in Remix. The return values of this function will be injected in the worker action/loader.
 * @param {FetchEvent} [event] The fetch event request.
 * @returns {object} the context object.
 */
export const getLoadContext = () => {
  // const stores = createStorageRepository();

  return {
    database: [],
    stores: [],
  };
};

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});


// export const msg = 'Hello from the worker edite d!'
// function shouldIgnoreRoute(route, patterns) {
//   // Function to convert a pattern to a regular expression
//   function convertPatternToRegEx(pattern) {
//   if (pattern.endsWith('/') && pattern.substring(-2) !== '*') {
//     pattern = pattern.split('').slice(0, -1).join('')
//   }
//   /* console.log(pattern) */
//       let regexPattern = pattern
//           .replace(/^\//, '')      // Remove leading slash if exists
//           .replace(/\*\*/g, '.*')  // Replace ** with .*
//           .replace(/\*/g, '[^/]*') // Replace * with [^/]*
//           .replace(/\//g, '\\/');  // Escape forward slashes

//       if (!pattern.startsWith('/')) {
//           regexPattern = '(?:\\/)?' + regexPattern; // Make leading slash optional
//       }

//       return new RegExp('^' + regexPattern + '$');
//   }

//   // Convert all patterns to regular expressions
//   const regexPatterns = patterns.map(convertPatternToRegEx);

//   // Check if the route matches any of the patterns
//   return regexPatterns.some(regexPattern => regexPattern.test(route));
// }

// // Example usage
// const patterns = ['landing/*', '**/landing/*/', '/**/landing/'];
// console.log(shouldIgnoreRoute('/landing/page', patterns));  // true
// console.log(shouldIgnoreRoute('landing/page', patterns));   // true
// console.log(shouldIgnoreRoute('/home/landing/page', patterns)); // true
// console.log(shouldIgnoreRoute('/home/landing/page', patterns)); // true
// console.log(shouldIgnoreRoute('home/landing', patterns));  // true
// console.log(shouldIgnoreRoute('/landingpage', patterns));  // false
// console.log(shouldIgnoreRoute('landingpage', patterns));   // false

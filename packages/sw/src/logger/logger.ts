/* eslint-disable no-var */
// these only become globals with var
declare global {
  /**
   * Disable all logs from displaying in the console.
   *
   * @default false
   */
  var __DISABLE_PWA_DEV_LOGS: boolean;
  /**
   * Disable debug logs from displaying in the console.
   *
   * @default false
   */
  var __DISABLE_PWA_DEBUG_LOGS: boolean;
  /**
   * Disable info logs from displaying in the console.
   *
   * @default false
   */
  var __DISABLE_PWA_INFO_LOGS: boolean;
  /**
   * Disable warning logs from displaying in the console.
   *
   * @default false
   */
  var __DISABLE_PWA_WARN_LOGS: boolean;
  /**
   * Disable error logs from displaying in the console.
   *
   * @default false
   */
  var __DISABLE_PWA_ERROR_LOGS: boolean;
}
/* eslint-enable no-var */

export type LoggerMethods = 'debug' | 'info' | 'log' | 'warn' | 'error' | 'groupCollapsed' | 'groupEnd';

const methodToColorMap: { [methodName: string]: string | null } = {
  debug: `#7f8c8d`, // Gray
  log: `#2ecc71`, // Green
  info: `#3498db`, // Blue
  warn: `#f39c12`, // Yellow
  error: `#c0392b`, // Red
  groupCollapsed: `#3498db`, // Blue
  groupEnd: null, // No colored prefix on groupEnd
};

export const logger = (
  process.env.NODE_ENV === 'production'
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const api: { [methodName: string]: Function } = {};
        const loggerMethods = Object.keys(methodToColorMap);

        for (const key of loggerMethods) {
          const method = key as LoggerMethods;
          api[method] = () => {};
        }

        return api as unknown;
      })()
    : (() => {
        // Todo: Add a way to disable logs by default, ig.
        // This throws an error: `self is not defined`
        // if (('__DISABLE_PWA_DEBUG_LOGS' in self) == false) {
        //   self.__DISABLE_PWA_DEBUG_LOGS = false;
        // }

        // if (('__DISABLE_PWA_DEV_LOGS' in self) == false) {
        //   self.__DISABLE_PWA_DEV_LOGS = false;
        // }

        // if (('__DISABLE_PWA_DEBUG_LOGS' in self) == false) {
        //   self.__DISABLE_PWA_DEBUG_LOGS = false;
        // }

        // if (('__DISABLE_PWA_INFO_LOGS' in self) == false) {
        //   self.__DISABLE_PWA_INFO_LOGS = false;
        // }

        // if (('__DISABLE_PWA_WARN_LOGS' in self) == false) {
        //   self.__DISABLE_PWA_WARN_LOGS = false;
        // }

        let inGroup = false;

        const print = function (method: LoggerMethods, args: any[]) {
          const self = typeof globalThis.self !== 'undefined' ? globalThis.self : globalThis;

          // Conditionals to handle various log levels.
          if (self.__DISABLE_PWA_DEV_LOGS) {
            return;
          }

          if (method === 'debug' && self.__DISABLE_PWA_DEBUG_LOGS) {
            return;
          }

          if (method === 'info' && self.__DISABLE_PWA_INFO_LOGS) {
            return;
          }

          if (method === 'warn' && self.__DISABLE_PWA_WARN_LOGS) {
            return;
          }

          if (method === 'error' && self.__DISABLE_PWA_ERROR_LOGS) {
            return;
          }

          if (method === 'groupCollapsed') {
            // Safari doesn't print all console.groupCollapsed() arguments:
            // https://bugs.webkit.org/show_bug.cgi?id=182754
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
              console[method](...args);
              return;
            }
          }

          const styles = [
            `background: ${methodToColorMap[method]!}`,
            `border-radius: 0.5em`,
            `color: white`,
            `font-weight: bold`,
            `padding: 2px 0.5em`,
          ];

          const logPrefix = inGroup ? [] : ['%cremix-pwa', styles.join(';')];

          console[method](...logPrefix, ...args);

          if (method === 'groupCollapsed') {
            inGroup = true;
          }
          if (method === 'groupEnd') {
            inGroup = false;
          }
        };

        // eslint-disable-next-line @typescript-eslint/ban-types
        const api: { [methodName: string]: Function } = {};
        const loggerMethods = Object.keys(methodToColorMap);

        for (const key of loggerMethods) {
          const method = key as LoggerMethods;

          api[method] = (...args: any[]) => {
            print(method, args);
          };
        }

        return api as unknown;
      })()
) as Console;

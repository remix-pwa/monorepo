export type LogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error' | 'groupCollapsed' | 'groupEnd';

interface LoggerOptions {
  prefix: string;
  styles: {
    [level in LogLevel]: string;
  };
  logLevel: LogLevel;
  isProductionEnv: boolean;
}

export class Logger {
  static defaultOptions: LoggerOptions = {
    prefix: 'remix-pwa',
    styles: {
      debug: 'background: #7f8c8d; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      info: 'background: #3498db; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      log: 'background: #2ecc71; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      warn: 'background: #f39c12; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      error: 'background: #c0392b; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      groupCollapsed: 'background: #3498db; color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
      groupEnd: 'color: white; border-radius: 0.5em; font-weight: bold; padding: 2px 0.5em;',
    },
    logLevel: 'debug',
    isProductionEnv: process.env.NODE_ENV === 'production',
  };

  private options: LoggerOptions;
  private inGroup = false;

  constructor(options?: Partial<LoggerOptions>) {
    this.options = { ...Logger.defaultOptions, ...options };
  }

  private print(level: LogLevel, args: any[]) {
    const { isProductionEnv, styles } = this.options;

    if (isProductionEnv) return;

    const method = level;
    // const self = typeof globalThis.self !== 'undefined' ? globalThis.self : globalThis;

    if (method === 'groupCollapsed') {
      if (/^((?!chrome|android).*safari)/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }

    const logPrefix = this.inGroup ? [] : [`%c${this.options.prefix}`, styles[level]];
    console[method](...logPrefix, ...args);

    if (method === 'groupCollapsed') {
      this.inGroup = true;
    }

    if (method === 'groupEnd') {
      this.inGroup = false;
    }
  }

  debug(...args: any[]) {
    this.shouldLog('debug') && this.print('debug', args);
  }

  info(...args: any[]) {
    this.shouldLog('info') && this.print('info', args);
  }

  log(...args: any[]) {
    this.shouldLog('log') && this.print('log', args);
  }

  warn(...args: any[]) {
    this.shouldLog('warn') && this.print('warn', args);
  }

  error(...args: any[]) {
    this.shouldLog('error') && this.print('error', args);
  }

  groupCollapsed(...args: any[]) {
    this.print('groupCollapsed', args);
  }

  groupEnd() {
    this.print('groupEnd', []);
  }

  private shouldLog(level: LogLevel) {
    const { logLevel } = this.options;
    const logLevels = ['debug', 'info', 'log', 'warn', 'error'];
    const currentLogLevel = logLevels.indexOf(level);
    const targetLogLevel = logLevels.indexOf(logLevel);

    return currentLogLevel >= targetLogLevel;
  }
}

export const logger = new Logger();

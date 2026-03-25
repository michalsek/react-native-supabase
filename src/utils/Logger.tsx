export enum LogLevel {
  DEBUG = 4,
  INFO = 3,
  WARN = 2,
  ERROR = 1,
}

export enum LogCategory {
  Auth = 'auth',
  Database = 'database',
  Realtime = 'realtime',
  Functions = 'functions',
  Storage = 'storage',
  Other = 'other',
}

const categoryColors: Record<string, string> = {
  [LogCategory.Auth]: '#4F46E5',
  [LogCategory.Database]: '#059669',
  [LogCategory.Realtime]: '#D97706',
  [LogCategory.Functions]: '#B91C1C',
  [LogCategory.Storage]: '#047857',
  [LogCategory.Other]: '#6B7280',
  Reset: '\x1b[0m',
};

const disabledInDev: LogCategory[] = [];
let logLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.INFO;

class Logger {
  private isDisabled: boolean;
  private category?: LogCategory;

  constructor(category?: LogCategory) {
    this.category = category;
    this.isDisabled = disabledInDev.includes(category as LogCategory);
  }

  public extend(category: LogCategory): Logger {
    return new Logger(category);
  }

  public disable(): void {
    this.isDisabled = true;
  }

  public enable(): void {
    this.isDisabled = false;
  }

  public setLogLevel(level: LogLevel): void {
    logLevel = level;
  }

  private formatConsoleMessage(args: unknown[]): (string | unknown)[] {
    if (!this.category) {
      return args;
    }

    return [
      `${categoryColors[this.category as LogCategory]}■ ${
        categoryColors.Reset
      }[${this.category}]`,
      ...args,
    ];
  }

  public log(...args: unknown[]): void {
    if (this.isDisabled || logLevel < LogLevel.INFO) {
      return;
    }

    console.info(...this.formatConsoleMessage(args));
  }

  public debug(...args: unknown[]): void {
    if (this.isDisabled || logLevel < LogLevel.DEBUG) {
      return;
    }

    console.debug(...this.formatConsoleMessage(args));
  }

  public warn(...args: unknown[]): void {
    if (this.isDisabled || logLevel < LogLevel.WARN) {
      return;
    }

    console.warn(...this.formatConsoleMessage(args));
  }

  public error(...args: unknown[]): void {
    if (this.isDisabled || logLevel < LogLevel.ERROR) {
      return;
    }

    console.error(...this.formatConsoleMessage(args));
  }
}

export default new Logger();

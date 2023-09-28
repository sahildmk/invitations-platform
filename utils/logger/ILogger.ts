export interface ILogger {
  log: (_message: string) => void;

  error: (_error: unknown) => void;

  warn: (_message: string) => void;
}

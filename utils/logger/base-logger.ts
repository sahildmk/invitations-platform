import { env } from "../env.mjs";
import { ILogger } from "./ILogger";

class Logger implements ILogger {
  log(message: string): void {
    console.log(message);
  }

  error(_error: unknown): void {
    console.log(env.NEXT_PUBLIC_NODE_ENV);

    console.error(_error);
  }

  warn(message: string): void {
    console.warn(message);
  }
}

export default Logger;

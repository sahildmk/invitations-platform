import { env } from "../env.mjs";
import { ILogger } from "./ILogger";
import { logtail } from "./logtail-logger";

class Logger implements ILogger {
  log(message: string): void {
    if (env.NEXT_PUBLIC_NODE_ENV === "development") console.log(message);
    else logtail.log(message);
  }

  error(_error: any): void {
    if (env.NEXT_PUBLIC_NODE_ENV === "development") console.error(_error);
    else logtail.error(_error);
  }

  warn(message: string): void {
    if (env.NEXT_PUBLIC_NODE_ENV === "development") console.warn(message);
    else logtail.warn(message);
  }
}

export default Logger;

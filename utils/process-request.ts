import { logger } from "./logger/logger";

export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: unknown;
    };

// export const ProcessRequest = <TArgs extends any[], TReturn>(
//   func: (..._args: TArgs) => TReturn,
//   ...args: TArgs
// ): Result<TReturn> => {
//   try {
//     return {
//       value: func(...args),
//       ok: true,
//     };
//   } catch (e) {
//     logger.error(e);
//     return {
//       error: e,
//       ok: false,
//     };
//   }
// };

export const ProcessRequestAsync = async <TArgs extends any[], TReturn>(
  func: (..._args: TArgs) => Promise<TReturn>,
  ...args: TArgs
): Promise<Result<TReturn>> => {
  try {
    return {
      value: await func(...args),
      ok: true,
    };
  } catch (e) {
    logger.error(e);
    return {
      error: e,
      ok: false,
    };
  }
};

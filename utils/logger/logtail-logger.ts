import { Logtail } from "@logtail/node";
import { env } from "../env.mjs";

export const logtail = new Logtail(env.NEXT_PUBLIC_LOGTAIL_TOKEN);

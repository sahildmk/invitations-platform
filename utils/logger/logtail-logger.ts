import { Node } from "@logtail/js";
import { env } from "../env.mjs";

export const logtail = new Node(env.NEXT_PUBLIC_LOGTAIL_TOKEN);

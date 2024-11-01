import { handle } from "hono/vercel";

import { api } from "../dist/index";

export const runtime = "edge";

const handler = handle(api);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

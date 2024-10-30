import { Hono } from "hono";
import {
  auth,
  merkleTree,
  mint,
  peerReview,
  research,
  researcherProfile,
} from "./server/routes";
import { getConnection } from "./utils/helpers";
import { handle } from "hono/vercel";
import { useDeResearcherSubscription } from "./indexer/subscription";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { db } from "./db/conn";

// // This is the entrypoint for the API server
// const solanaConnection = getConnection("devnet");

// // Subscriptions
// const subscriptions = useDeResearcherSubscription(solanaConnection, db);

// console.log("Subscriptions", subscriptions);

// API server
const api = new Hono().basePath("/api");

api.use("/", cors());
api.use(logger());
api.use(prettyJSON());

api.get("/", (c) => {
  return c.text("Hello from deResearcher API, please use the /api endpoint");
});

api.route("/research", research.route);

api.route("/researcher-profile", researcherProfile.route);

api.route("/peer-review", peerReview.route);

api.route("/mint", mint.route);

api.route("/merkle-tree", merkleTree.route);

api.route("/auth", auth.route);

const handler = handle(api);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

export default {
  port: 5000,
  fetch: api.fetch,
};

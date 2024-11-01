import { Hono } from "hono";
import {
  auth,
  merkleTree,
  mint,
  peerReview,
  research,
  researcherProfile,
} from "./server/routes/index.js";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
// import { db } from "./db/conn.js";
// // This is the entrypoint for the API server
// const solanaConnection = getConnection("devnet");
// // Subscriptions
// const subscriptions = useDeResearcherSubscription(solanaConnection, db);
// console.log("Subscriptions", subscriptions);
// API server
export const api = new Hono().basePath("/api");
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
console.log(`Server is running on port http://localhost:${5000}`);
serve({
  fetch: api.fetch,
  port: 5000,
});

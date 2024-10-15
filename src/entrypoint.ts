import { Hono } from "hono";
import { research } from "./server/routes";
import { getConnection } from "./utils/helpers";

const api = new Hono().basePath("/api");

export const solanaConnection = getConnection("devnet");

api.get("/", (c) => {
  return c.text("Hello from deResearcher API");
});

api.route("/research", research.route);

export default {
  port: 5000,
  fetch: api.fetch,
};

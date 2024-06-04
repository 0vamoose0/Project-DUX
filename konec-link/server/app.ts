import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { authRoute } from "./routes/auth";
import { sanityRoute } from "./routes/sanity";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .get("/healthcheck", (c) => {
    return c.json({ status: "ok" });
  })
  .route("/sanity", sanityRoute)
  .route("/", authRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;

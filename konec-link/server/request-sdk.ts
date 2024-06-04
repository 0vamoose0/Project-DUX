import { GraphQLClient } from "graphql-request";
import { createMiddleware } from "hono/factory";
import { getSdk } from "./generated/sdk";

type Env = {
  Variables: {
    sdk: ReturnType<typeof getSdk>;
  };
};

export const getSanitySDK = createMiddleware<Env>(async (c, next) => {
  try {
    if (!process.env.SANITY_GRAPHQL_ENDPOINT) {
      throw new Error("SANITY_GRAPHQL_ENDPOINT not set");
    }

    const client = new GraphQLClient(process.env.SANITY_GRAPHQL_ENDPOINT);
    const sdk = getSdk(client);

    c.set("sdk", sdk);

    await next();
  } catch (error) {
    console.error(error);
    return c.json(
      { error: (error as Error)?.message || "Error: getSanitySDK" },
      500,
    );
  }
});

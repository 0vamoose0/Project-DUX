import { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  schema: process.env.SANITY_GRAPHQL_ENDPOINT,
  documents: ["server/**/*.graphql"],
  generates: {
    "server/generated/sdk.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;

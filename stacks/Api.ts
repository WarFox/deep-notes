import { use, ApiGateway, StackContext } from "sst/constructs";
import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  // Create a HTTP API
  const api = new ApiGateway(stack, "Api", {
    defaults: {
      function: {
        // Bind the database to our API
        bind: [use(Database)],
      },
    },
    routes: {
      "GET /": "packages/functions/src/get-count.main",
      "POST /": "packages/functions/src/lambda.main",
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}

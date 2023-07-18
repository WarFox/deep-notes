import { use, Config, Api as ApiGateway, StackContext } from "sst/constructs";
import { Database } from "./Database";

export function Api({ stack }: StackContext) {
  /* set secret */
  // https://docs.sst.dev/config#define-a-secret

  const ABLY_KEY = new Config.Secret(stack, "ABLY_KEY");
  // set the secert with
  // npx sst secrets set ABLY_KEY *value*

  // Create a HTTP API
  const api = new ApiGateway(stack, "Api", {
    defaults: {
      function: {
        // Bind the database to our API
        bind: [use(Database)],
      },
    },
    routes: {
      // Needs Authentication
      "POST /ably-token": {
        function: {
          handler: "packages/functions/src/ably-token.handler",
          bind: [ABLY_KEY],
        },
      },
      "GET /notes": "packages/functions/src/list.handler",
      "POST /notes": "packages/functions/src/create.handler",
      "GET /notes/{id}": "packages/functions/src/get.handler",
      "PUT /notes/{id}": "packages/functions/src/update.handler",
      "DELETE /notes/{id}": "packages/functions/src/delete.handler",
    },
  });

  stack.addOutputs({
    API: api.url,
  });

  return api;
}

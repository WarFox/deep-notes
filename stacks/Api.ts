import { use, Config, Api as ApiGateway, StackContext } from "sst/constructs";
import { Database } from "./Database";
import { Auth } from "./Auth";

export function Api({ stack }: StackContext) {
  /* set secret */
  // https://docs.sst.dev/config#define-a-secret

  // set the secert with following command
  // npx sst secrets set ABLY_KEY *value*
  const ABLY_KEY = new Config.Secret(stack, "ABLY_KEY");

  const auth = use(Auth);
  const database = use(Database);

  // Create a HTTP API
  const api = new ApiGateway(stack, "Api", {
    cors: {
      allowMethods: ["ANY"],
      allowHeaders: ["Authorization"],
      allowOrigins: ["*"],
    },
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        // Bind the database to our API
        bind: [database],
      },
    },
    routes: {
      // Needs Authentication
      "POST /ably-token": {
        function: {
          handler: "packages/functions/src/ably-token.handler",
          bind: [ABLY_KEY], // this secret should only available to abl-token handler function
        },
      },
      "GET /notes": "packages/functions/src/list.handler",
      "POST /notes": "packages/functions/src/create.handler",
      "GET /notes/{id}": "packages/functions/src/get.handler",
      "PUT /notes/{id}": "packages/functions/src/update.handler",
      "DELETE /notes/{id}": "packages/functions/src/delete.handler",
    },
  });

  // allowing authenticated users to access API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    API: api.url,
  });

  return api;
}

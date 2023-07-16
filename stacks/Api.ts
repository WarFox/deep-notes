import { use, Api, StackContext } from "sst/constructs";
import { Database } from "./Database";

export function NotesApi({ stack }: StackContext) {
  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the database to our API
        bind: [use(Database)],
      },
    },
    routes: {
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

import { use, StackContext, StaticSite } from "sst/constructs";
import { NotesApi } from "./Api.js";

export function Web({ stack }: StackContext) {
  const api = use(NotesApi);

  const site = new StaticSite(stack, "VueJSSite", {
    path: "packages/frontend",
    buildOutput: "dist",
    buildCommand: "npm run build",
    errorPage: "redirect_to_index_page",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}

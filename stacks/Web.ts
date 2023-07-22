import { use, StackContext, StaticSite } from "sst/constructs";
import { Api } from "./Api";
import { Auth } from "./Auth";

export function Web({ stack }: StackContext) {
  const api = use(Api);
  const auth = use(Auth);

  const site = new StaticSite(stack, "VueJSSite", {
    path: "packages/frontend",
    buildOutput: "dist",
    buildCommand: "npm run build",
    errorPage: "redirect_to_index_page",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.url,
      VITE_APP_USER_POOL_ID: auth.userPoolId,
      VITE_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}

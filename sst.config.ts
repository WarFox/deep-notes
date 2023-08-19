import { Api } from "./stacks/Api";
import { Auth } from "./stacks/Auth";
import { Database } from "./stacks/Database";
import { SSTConfig } from "sst";
import { Tags } from "aws-cdk-lib";
import { Web } from "./stacks/Web";

export default {
  config(_input) {
    return {
      name: "deep-notes",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    Tags.of(app).add("Created_By", `SST`);
    app.stack(Database).stack(Auth).stack(Api).stack(Web);
  },
} satisfies SSTConfig;

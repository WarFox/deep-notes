import { SSTConfig } from "sst";
import { Api } from "./stacks/Api";
import { Web } from "./stacks/Web";
import { Database } from "./stacks/Database";

export default {
  config(_input) {
    return {
      name: "sst-vue-notes",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(Database).stack(Api).stack(Web);
  },
} satisfies SSTConfig;

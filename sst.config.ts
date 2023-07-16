import { SSTConfig } from "sst";
import { NotesApi } from "./stacks/Api";
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
    app.stack(Database).stack(NotesApi).stack(Web);
  },
} satisfies SSTConfig;

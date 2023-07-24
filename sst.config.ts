import { SSTConfig } from "sst";
import { Api } from "./stacks/Api";
import { Auth } from "./stacks/Auth";
import { Database } from "./stacks/Database";
import { Web } from "./stacks/Web";

export default {
    config(_input) {
        return {
            name: "deep-notes",
            region: "eu-west-1",
        };
    },
    stacks(app) {
        app.stack(Database).stack(Auth).stack(Api).stack(Web);
  },
} satisfies SSTConfig;

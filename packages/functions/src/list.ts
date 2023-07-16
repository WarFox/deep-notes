import { Notes } from "@sst-vue-notes/core/notes";

export async function handler() {
  return {
    statusCode: 200,
    body: Notes.list(),
  };
}

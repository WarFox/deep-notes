import { Notes } from "@sst-vue-notes/core/notes";

export async function handler() {
  return {
    statusCode: 201,
    body: Notes.create({ userId: "some user id", content: "some content" }),
  };
}

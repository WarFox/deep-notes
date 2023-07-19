import { Notes } from "@sst-vue-notes/core/notes";

export async function handler() {
  return {
    statusCode: 201,
    body: Notes.create({
      createdBy: "some user id",
      title: "newtitel",
      content: "some content",
    }),
  };
}

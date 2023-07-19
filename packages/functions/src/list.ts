import { Notes } from "@deep-notes/core/notes";

export async function handler() {
  return {
    statusCode: 200,
    body: Notes.list(),
  };
}

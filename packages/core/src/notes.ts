export * as Notes from "./notes";

import { ulid } from "ulid";
import { SQL } from "./sql";

interface Note {
  noteId: String;
  title: String;
  content: String;
  createdAt: Date;
  createdBy: String;
}

export async function create(note: {
  createdBy: String;
  title: String;
  content: String;
}) {
  const [result] = await SQL.DB.insertInto("notes")
    .values({
      note_id: ulid(),
      created_by: note.createdBy,
      title: note.title,
      content: note.content,
    })
    .returningAll()
    .execute();
  return result;
}

export function remove(noetId: String) {
  return undefined;
}

export function update(note: {
  noetId: String;
  userId: String;
  content: String;
}) {
  return undefined;
}

export function get(noteId: String) {
  return {} as Note;
}

export function list() {
  return [] as Note[];
}

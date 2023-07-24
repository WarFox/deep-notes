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

export async function create(title: String, createdBy: String): Promise<Note> {
  const [result] = await SQL.DB.insertInto("notes")
    .values({
      note_id: ulid(),
      created_by: createdBy,
      title: title,
    })
    .returningAll()
    .execute();
  return result;
}

export function remove(noteId: String) {
  return undefined;
}

export function updateTitle(noteId: String, title: String) {
  return undefined;
}

export function updateContent(noteId: String, content: String) {
  return undefined;
}

export function get(noteId: String) {
  return {} as Note;
}

export async function list() {
  return await SQL.DB.selectFrom("notes").selectAll().limit(10).execute();
}

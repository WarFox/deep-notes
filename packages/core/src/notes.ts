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
  title: String;
  createdBy: String;
}): Promise<Note> {
  const newNote = { noteId: ulid(), ...note };
  const [result] = await SQL.DB.insertInto("notes")
    .values(newNote)
    .returningAll()
    .execute();
  return result;
}

export async function remove(noteId: String) {
  const result = await SQL.DB.deleteFrom("notes")
    .where("notes.note_id", "=", noteId)
    .executeTakeFirst();
  return result.numDeletedRows;
}

export function updateTitle(noteId: String, title: String) {
  return undefined;
}

export function updateContent(noteId: String, content: String) {
  return undefined;
}

export async function find(noteId: String) {
  return await SQL.DB.selectFrom("notes")
    .selectAll()
    .where("notes.note_id", "=", noteId)
    .executeTakeFirst();
}

export async function list() {
  return await SQL.DB.selectFrom("notes").selectAll().limit(10).execute();
}

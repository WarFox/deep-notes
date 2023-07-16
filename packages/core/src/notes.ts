export * as Notes from "./notes";

interface Note {
  noteId: String;
  content: String;
  createdAt: Date;
  createdBy: String;
  updatedAt: Date;
  updatedBy: String;
}

export function create(note: { userId: String; content: String }) {
  return undefined;
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

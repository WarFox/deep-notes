import { beforeEach, describe, expect, it } from "vitest";
import { Notes } from "../src/notes";

beforeEach(async () => {
  // clear db
});

describe("Notes", () => {
  it("create a note", async () => {
    // Create a new note
    const note = await Notes.create({
      title: "some title",
      userId: "user1",
    });

    // List all notes
    const list = await Notes.list();

    expect(list.find((n) => n.title === note.title)).not.toBeUndefined();
  });

  it("remove a note", async () => {
    const note = await Notes.create({
      title: "some title",
      userId: "user1",
    });

    const result = await Notes.remove(note.noteId);

    expect(result).toBe(1n);

    const list = await Notes.list();

    expect(list.find((n) => n.noteId === note.noteId)).toBeUndefined();
  });

  it("find a note", async () => {
    const note = await Notes.create({
      title: "some title",
      userId: "user1",
    });

    const result = await Notes.find(note.noteId);
    expect(result).toEqual(note);
  });
});

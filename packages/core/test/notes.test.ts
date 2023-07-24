import { beforeEach, describe, expect, it } from "vitest";
import { Notes } from "../src/notes";
import { SQL } from "../src/sql";

beforeEach(async () => {
  SQL.DB.deleteFrom("notes").execute();
});

describe("Notes", () => {
  it("create a note", async () => {
    // Create a new article
    const note = await Notes.create("some title", "user1");

    // List all articles
    const list = await Notes.list();

    // Check the newly created article exists
    expect(list.find((n) => n.title === note.title)).not.toBeUndefined();
  });
});

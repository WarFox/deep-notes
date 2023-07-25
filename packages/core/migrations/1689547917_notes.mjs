import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("notes")
    .addColumn("note_id", "varchar", (col) => col.primaryKey())
    .addColumn("title", "varchar")
    .addColumn("content", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn("created_by", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("idx_notes_created_by")
    .on("notes")
    .column("created_by")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex("idx_notes_created_by").execute();
  await db.schema.dropTable("notes").execute();
}

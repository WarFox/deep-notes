import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Notes {
  note_id: string;
  title: string | null;
  content: string | null;
  created_at: Generated<Timestamp>;
  created_by: string;
}

export interface Database {
  notes: Notes;
}

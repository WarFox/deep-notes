import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Notes {
  note_id: string;
  title: string;
  content: string;
  created_at: Generated<Timestamp>;
  created_by: string;
  updated_at: Generated<string>;
  updated_by: string;
}

export interface Database {
  notes: Notes;
}

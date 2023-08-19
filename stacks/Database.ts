import { StackContext, Table } from "sst/constructs";

export function Database({ stack }: StackContext) {
  const table = new Table(stack, "Notes", {
    fields: {
      PK: "string",
      SK: "string",
      noteId: "string",
      userId: "string",
      firstName: "string",
      lastName: "string",
      title: "string",
      content: "string",
      createdAt: "number",
    },
    primaryIndex: { partitionKey: "PK", sortKey: "SK" },
  });

  return table;
}

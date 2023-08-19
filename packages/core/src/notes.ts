export * as Notes from "./notes";

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";
import { ulid } from "ulid";

interface Note {
  // ulid value, lexicographically sortable unique ids
  noteId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number;
}

// Full DynamoDB Client
const client = new DynamoDB({});

const ddbDocClient = DynamoDBDocument.from(client);

export async function create(note: {
  title: string;
  userId: string;
}): Promise<Note> {
  const noteId = ulid();
  const newNote = {
    ...note,
    content: "",
    createdAt: Date.now(),
  };

  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    Item: { ...newNote, PK: "note", SK: noteId },
  };
  await ddbDocClient.put(params);
  const result = { ...newNote, noteId };
  return result;
}

export async function remove(noteId: string) {
  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    // Get the row where the noteId is the one in the path
    Key: {
      PK: "note",
      SK: noteId,
    },
  };
  await ddbDocClient.delete(params);
}

export async function updateTitle(noteId: string, title: string) {
  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    // Get the row where the noteId is the one in the path
    Key: {
      PK: "note",
      SK: noteId,
    },
    // Update the "content" column with the one passed in
    UpdateExpression: "SET title = :title",
    ExpressionAttributeValues: {
      ":title": title || null,
    },
    ReturnValues: "ALL_NEW",
  };

  const results = await ddbDocClient.update(params);
  return results.Attributes;
}

export async function updateContent(noteId: string, content: string) {
  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    // Get the row where the noteId is the one in the path
    Key: {
      PK: "note",
      SK: noteId,
    },
    // Update the "content" column with the one passed in
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":content": content || null,
    },
    ReturnValues: "ALL_NEW",
  };

  const results = await ddbDocClient.update(params);
  return results.Attributes;
}

export async function find(noteId: string) {
  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    // Get the row where the noteId is the one in the path
    Key: {
      PK: "note",
      SK: noteId,
    },
  };
  const results = await ddbDocClient.get(params);
  return results.Item;
}

export async function list() {
  const params = {
    // Get the table name from the environment variable
    TableName: Table.Notes.tableName,
    // Get all the rows where
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": "note",
    },
  };
  const results = await ddbDocClient.query(params);

  const notes = results.Items?.map((item) => {
    return {
      content: item.content,
      noteId: item.SK,
      userId: item.userId,
      title: item.title,
      createdAt: item.createdAt,
    };
  });

  return notes;
}

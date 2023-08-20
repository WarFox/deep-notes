import { Notes } from "@deep-notes/core/notes";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyEventV2,
} from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const noteId = event?.pathParameters?.id;

    if (noteId) {
      const result = await Notes.remove(noteId);

      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 204, // no-content
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened while creating a note",
      }),
    };
  }
};

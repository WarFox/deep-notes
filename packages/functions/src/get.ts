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
      const result = await Notes.find(noteId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 200,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened while listing notes",
      }),
    };
  }
};

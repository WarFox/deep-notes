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
    const { body } = event;

    const data = JSON.parse(body);

    const result = await Notes.create(data);

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened while creating a note",
      }),
    };
  }
};

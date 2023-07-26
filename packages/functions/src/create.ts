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

    const user = event.requestContext.authorizer?.jwt.claims.sub;
    if (user) {
      const data = JSON.parse(body);

      const result = await Notes.create({ ...data, createdBy: user });

      return {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      };
    }

    return {
      statusCode: 204, // no-content
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

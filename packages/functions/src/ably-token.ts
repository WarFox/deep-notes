// https://ably.com/docs/auth/token?lang=nodejs
import { Realtime, Types } from "ably";
import { Config } from "sst/node/config";

export async function handler(event) {
  const realtime = new Realtime({
    key: Config.ABLY_KEY,
  });

  const queryStringParameters = event["queryStringParameters"];

  // rnd is a queryparameter send by Ably.Realtime to authUrl
  const tokenParams: Types.TokenParams = {
    clientId: queryStringParameters.rnd,
  };

  const tokenRequestData = await new Promise((resolve, reject) => {
    realtime.auth.createTokenRequest(tokenParams, null, (err, tokenRequest) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokenRequest);
      }
    });
  });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(tokenRequestData),
  };
}

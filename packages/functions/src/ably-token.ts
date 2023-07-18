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

  const tokenRequest = await new Promise((resolve, reject) => {
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
    body: JSON.stringify(tokenRequest),
  };
}

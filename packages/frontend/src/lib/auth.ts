import { Auth } from 'aws-amplify'

import { Authenticator as ImportedAuthenticator, useAuthenticator } from '@aws-amplify/ui-vue'

export const auth = useAuthenticator()

export const Authenticator = ImportedAuthenticator

/*
 * Use accessToken for accessing API gateway and other AWS Resources
 * Do not use IdToken as it contains pii information about the user
 */
export async function getAccessTokenJwt() {
  const session = await Auth.currentSession()
  const accessToken = session.getAccessToken()
  return accessToken.getJwtToken()
}

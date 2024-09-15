// src/lib/authorizerConfig.ts
import { Authorizer } from '@authorizerdev/authorizer-js'
import { AUTHORIZER_URL, CLIENT_ID } from '$lib/config'

const authRef = new Authorizer({
  authorizerURL: AUTHORIZER_URL,
  redirectURL: AUTHORIZER_URL,
  clientID: CLIENT_ID, // obtain your client id from authorizer dashboard
})
 
export default authRef;
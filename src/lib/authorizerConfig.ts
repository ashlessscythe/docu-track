// src/lib/authorizerConfig.ts
import { Authorizer, type ApiResponse, type AuthToken } from '@authorizerdev/authorizer-js'
import { APP_URL, AUTHORIZER_URL, CLIENT_ID } from '$lib/config'

const authRef = new Authorizer({
  authorizerURL: AUTHORIZER_URL,
  redirectURL: APP_URL,
  clientID: CLIENT_ID, // obtain your client id from authorizer dashboard
})
 
/**
 * Check if the user is authenticated.
 * @returns {Promise<APIResponse<AuthToken> | null>} Returns user session if authenticated, null otherwise.
 */
export const checkAuthStatus = async (): Promise<ApiResponse<AuthToken> | null> => {
  try {
    const session = await authRef.getSession();
    if (session) {
      return session;
    }
    return null;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return null;
  }
};


export default authRef;
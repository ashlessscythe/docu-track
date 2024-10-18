// src/lib/authorizerConfig.ts
import { Authorizer, type ApiResponse, type AuthToken, type User } from '@authorizerdev/authorizer-js'
import { APP_URL, AUTHORIZER_URL, CLIENT_ID } from '$lib/config'

const authRef = new Authorizer({
  authorizerURL: AUTHORIZER_URL,
  redirectURL: APP_URL,
  clientID: CLIENT_ID, // obtain your client id from authorizer dashboard
})
 
/**
 * Check if the user is authenticated.
 * @returns {Promise<User | null>} Returns user object if authenticated, null otherwise.
 */
export const checkAuthStatus = async (): Promise<User | null> => {
  try {
    const session = await authRef.getSession();
    if (session && session.data && session.data.user) {
      return session.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return null;
  }
};

export type { User };
export default authRef;

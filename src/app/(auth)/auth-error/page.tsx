import Link from "next/link";
import { APP_NAME } from "@/lib/config";

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Access denied. Please contact an administrator.",
  Configuration: "Server configuration error. Please try again later.",
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked:
    "Account not linked. Try signing in with the original provider.",
  OAuthCallback:
    "Sign-in failed due to an OAuth callback error. Please try again.",
  OAuthCreateAccount:
    "Could not create account with the provider. Please try again.",
  OAuthSignin: "OAuth sign-in failed. Please try again.",
  SessionRequired: "Your session has expired. Please sign in again.",
  Verification:
    "Verification failed or the link expired. Please request a new link.",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const errorCode = searchParams?.error;
  const message =
    (errorCode && ERROR_MESSAGES[errorCode]) ||
    "Authentication error. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-md border border-red-100 bg-white p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Sign in error</h2>
          <p className="text-sm text-gray-600">
            {APP_NAME} couldn&apos;t complete your sign-in.
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{message}</p>
          {errorCode && (
            <p className="mt-2 text-xs text-red-600">
              Error code: {errorCode}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Back to Sign in
          </Link>
          <Link
            href="/"
            className="text-center text-sm text-gray-600 hover:text-gray-900"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}

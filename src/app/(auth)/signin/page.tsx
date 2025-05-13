"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStackApp } from "@stackframe/stack";
import { APP_NAME } from "@/lib/config";

export default function SignInPage() {
  const router = useRouter();
  const app = useStackApp();

  useEffect(() => {
    // Redirect to Stack Auth sign-in page
    router.push("/handler/sign-in");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Redirecting to {APP_NAME} Sign In...
        </h2>
        <p className="mt-2">
          Please wait while we redirect you to the sign in page.
        </p>
        <button
          onClick={() => app.redirectToSignIn()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Click here if you are not redirected automatically
        </button>
      </div>
    </div>
  );
}

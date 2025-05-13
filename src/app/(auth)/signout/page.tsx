"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStackApp } from "@stackframe/stack";
import { APP_NAME } from "@/lib/config";

export default function SignOutPage() {
  const router = useRouter();
  const app = useStackApp();

  useEffect(() => {
    // Redirect to Stack Auth sign-out page
    router.push("/handler/sign-out");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Signing out of {APP_NAME}...</h2>
        <p className="mt-2">Please wait while we sign you out.</p>
        <button
          onClick={() => app.redirectToSignOut()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Click here if you are not redirected automatically
        </button>
      </div>
    </div>
  );
}

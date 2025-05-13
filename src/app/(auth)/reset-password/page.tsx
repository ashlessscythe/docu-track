"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStackApp } from "@stackframe/stack";
import { APP_NAME } from "@/lib/config";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const app = useStackApp();

  // Get token from URL if present
  const token = searchParams.get("token");
  const redirectUrl = token
    ? `/handler/reset-password?token=${encodeURIComponent(token)}`
    : "/handler/reset-password";

  useEffect(() => {
    // Redirect to Stack Auth reset password page
    router.push(redirectUrl);
  }, [router, redirectUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset Password - {APP_NAME}</h2>
        <p className="mt-2">
          Please wait while we redirect you to the password reset page.
        </p>
        <button
          onClick={() => router.push(redirectUrl)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Click here if you are not redirected automatically
        </button>
      </div>
    </div>
  );
}

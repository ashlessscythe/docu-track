"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    // Sign out without callbackUrl - NextAuth will use default behavior
    // Then redirect client-side to honor the current origin (127.0.0.1, localhost, etc.)
    signOut({ redirect: false }).then(() => {
      // Client-side redirect using current origin - safe and honors address bar
      window.location.href = `${window.location.origin}/signin`;
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Signing out...</h2>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}

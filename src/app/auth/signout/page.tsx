"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOutPage() {
  useEffect(() => {
    // Automatically trigger sign out when the page loads
    signOut({ callbackUrl: "/auth/signin" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Signing out...</h2>
          <p className="mt-2 text-gray-600">You are being redirected.</p>
        </div>
      </div>
    </div>
  );
}

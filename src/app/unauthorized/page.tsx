import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You do not have permission to access this page",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">You don&apos;t have access</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You do not have permission to access this page.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

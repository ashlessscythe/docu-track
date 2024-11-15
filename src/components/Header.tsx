"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </li>
          {session && (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              </li>
              {session.user.role === "ADMIN" && (
                <li>
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                </li>
              )}
              {(session.user.role === "APPROVER" ||
                session.user.role === "ADMIN") && (
                <li>
                  <Link
                    href="/approver"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Approver
                  </Link>
                </li>
              )}
              {(session.user.role === "SUBMITTER" ||
                session.user.role === "ADMIN") && (
                <li>
                  <Link
                    href="/submitter"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Submitter
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/signout"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </Link>
              </li>
            </>
          )}
          {!session && (
            <li>
              <Link
                href="/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

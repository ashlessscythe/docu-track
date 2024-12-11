"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-foreground hover:text-foreground/80">
              Home
            </Link>
          </li>
          {session && (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-foreground/80"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-foreground hover:text-foreground/80"
                >
                  Templates
                </Link>
              </li>
              {session.user.role === "ADMIN" && (
                <li>
                  <Link
                    href="/admin"
                    className="text-foreground hover:text-foreground/80"
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
                    className="text-foreground hover:text-foreground/80"
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
                    className="text-foreground hover:text-foreground/80"
                  >
                    Submitter
                  </Link>
                </li>
              )}
              {(session.user.role === "REPORTER" ||
                session.user.role === "ADMIN") && (
                <li>
                  <Link
                    href="/reports"
                    className="text-foreground hover:text-foreground/80"
                  >
                    Reports
                  </Link>
                </li>
              )}
            </>
          )}
          {!session && (
            <li>
              <Link
                href="/signin"
                className="text-foreground hover:text-foreground/80"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
        {session && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link
              href="/signout"
              className="border rounded px-2 py-1 text-white bg-red-600 hover:bg-red-700 transition-colors 
             dark:bg-red-500 dark:hover:bg-red-600"
            >
              Sign Out
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

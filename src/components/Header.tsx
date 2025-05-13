"use client";

import { useUser, UserButton } from "@stackframe/stack";
import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Palette, Moon, Sun, Flame, Leaf, Droplet } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function Header() {
  const user = useUser();
  const { theme, setTheme } = useTheme();

  // Theme icon mapping
  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "crimson":
        return <Flame className="h-5 w-5" />;
      case "mint":
        return <Leaf className="h-5 w-5" />;
      case "seafoam":
        return <Droplet className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  // Check user permissions
  const isAdmin = user?.usePermission("ADMIN");
  const isApprover = user?.usePermission("APPROVER");
  const isSubmitter = user?.usePermission("SUBMITTER");
  const isReporter = user?.usePermission("REPORTER");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-foreground hover:text-foreground/80">
              Home
            </Link>
          </li>
          {user && (
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
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className="text-foreground hover:text-foreground/80"
                  >
                    Admin
                  </Link>
                </li>
              )}
              {(isApprover || isAdmin) && (
                <li>
                  <Link
                    href="/approver"
                    className="text-foreground hover:text-foreground/80"
                  >
                    Approver
                  </Link>
                </li>
              )}
              {(isSubmitter || isAdmin) && (
                <li>
                  <Link
                    href="/submitter"
                    className="text-foreground hover:text-foreground/80"
                  >
                    Submitter
                  </Link>
                </li>
              )}
              {(isReporter || isAdmin) && (
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
          {!user && (
            <li>
              <Link
                href="/handler/sign-in"
                className="text-foreground hover:text-foreground/80"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
        {user && (
          <div className="flex items-center space-x-4">
            <FeedbackDialog />

            {/* Theme Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {getThemeIcon()}
                  <span className="sr-only">Change theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border border-background bg-background text-foreground rounded-md shadow-md"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("crimson")}>
                  <Flame className="mr-2 h-4 w-4" />
                  <span>Crimson</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("mint")}>
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>Mint</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("seafoam")}>
                  <Droplet className="mr-2 h-4 w-4" />
                  <span>Seafoam</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Button */}
            <UserButton />

            {/* Sign Out Link */}
            <Link
              href="/handler/sign-out"
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

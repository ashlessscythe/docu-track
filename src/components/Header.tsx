"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Moon,
  Sun,
  Flame,
  Leaf,
  Droplet,
  Zap,
  Sparkles,
  Menu,
} from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Theme =
  | "light"
  | "dark"
  | "crimson"
  | "mint"
  | "seafoam"
  | "cyberpunk"
  | "neon"
  | "system";

type NavLink = {
  href: string;
  label: string;
};

function getNavLinks(role?: string): NavLink[] {
  const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/templates", label: "Templates" },
  ];

  if (role === "ADMIN") {
    links.push({ href: "/admin", label: "Admin" });
  }
  if (role === "APPROVER" || role === "ADMIN") {
    links.push({ href: "/approver", label: "Approver" });
  }
  if (role === "SUBMITTER" || role === "ADMIN") {
    links.push({ href: "/submitter", label: "Submitter" });
  }
  if (role === "REPORTER" || role === "ADMIN") {
    links.push({ href: "/reports", label: "Reports" });
  }

  return links;
}

function ThemeMenuItems({
  setTheme,
}: {
  setTheme: (theme: Theme) => void;
}) {
  return (
    <>
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
      <DropdownMenuItem onClick={() => setTheme("cyberpunk")}>
        <Zap className="mr-2 h-4 w-4" />
        <span>Cyberpunk</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("neon")}>
        <Sparkles className="mr-2 h-4 w-4" />
        <span>Neon</span>
      </DropdownMenuItem>
    </>
  );
}

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

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
      case "cyberpunk":
        return <Zap className="h-5 w-5" />;
      case "neon":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  const navLinks = session
    ? getNavLinks(session.user.role)
    : [{ href: "/", label: "Home" }];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Desktop navigation */}
        <ul className="hidden md:flex space-x-4">
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

        {/* Mobile: app title */}
        <Link
          href="/"
          className="md:hidden text-lg font-semibold text-foreground"
        >
          DocuTrack
        </Link>

        {/* Desktop right actions */}
        {session ? (
          <div className="hidden md:flex items-center space-x-4">
            <FeedbackDialog />
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
                <ThemeMenuItems setTheme={setTheme} />
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/signout"
            >
              <Button variant="destructive" size="sm">Sign Out</Button>
            </Link>
          </div>
        ) : (
          <Link
            href="/signin"
            className="hidden md:block text-foreground hover:text-foreground/80"
          >
            Sign In
          </Link>
        )}

        {/* Mobile right actions */}
        <div className="flex md:hidden items-center gap-2">
          {session && (
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
                <ThemeMenuItems setTheme={setTheme} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-foreground hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                {!session && (
                  <Link
                    href="/signin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-foreground hover:bg-accent"
                  >
                    Sign In
                  </Link>
                )}
                {session && (
                  <>
                    <div className="my-2 border-t" />
                    <div className="px-3 py-2">
                      <FeedbackDialog />
                    </div>
                    <Link
                      href="/signout"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2 text-destructive hover:bg-accent"
                    >
                      Sign Out
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

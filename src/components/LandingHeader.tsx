"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Palette, Moon, Sun, Flame, Leaf, Droplet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LandingHeaderProps {
  user: any;
  appName: string;
}

export function LandingHeader({ user, appName }: LandingHeaderProps) {
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

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{appName}</h1>
        <div className="flex items-center gap-4">
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

          {user ? (
            <>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
              <Link href="/handler/sign-out">
                <Button variant="destructive">Sign Out</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/handler/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
          <a
            href="https://github.com/ashlessscythe/docu-track"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="opacity-75 hover:opacity-100 transition-opacity"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

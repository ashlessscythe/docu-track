import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";
import { LandingHeader } from "@/components/LandingHeader";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader session={session} appName={APP_NAME} />

      <main>
        {/* Hero Section */}
        <div className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Document Management{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 dark:from-indigo-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Streamline your document approval process with {APP_NAME}.
                Track, manage, and approve documents efficiently in one place.
              </p>
              {!session && (
                <div className="mt-10">
                  <Link href="/register">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Easy Submission
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Submit documents quickly and easily with our intuitive
                  interface.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Efficient Approval
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Streamlined approval process with role-based access control.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Track Progress
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor document status and track approval progress in
                  real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

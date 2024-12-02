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

        {/* Help & Resources Section */}
        <div className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Help & Resources
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to get started and succeed with {APP_NAME}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Link href="/user/guide" className="group">
                <div className="bg-card p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:bg-accent">
                  <div className="flex items-center mb-4 text-primary">
                    <svg
                      className="h-6 w-6 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      User Guide
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Comprehensive guide to using all features of the platform
                  </p>
                </div>
              </Link>

              <Link href="/user/faq" className="group">
                <div className="bg-card p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:bg-accent">
                  <div className="flex items-center mb-4 text-primary">
                    <svg
                      className="h-6 w-6 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      FAQ
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Quick answers to common questions about our platform
                  </p>
                </div>
              </Link>

              <Link href="/contact/support" className="group">
                <div className="bg-card p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:bg-accent">
                  <div className="flex items-center mb-4 text-primary">
                    <svg
                      className="h-6 w-6 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Contact Support
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get help from our support team when you need it
                  </p>
                </div>
              </Link>
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

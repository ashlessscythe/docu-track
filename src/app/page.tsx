import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/config";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/signin">
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
              className="text-gray-600 hover:text-gray-900"
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

      <main>
        {/* Hero Section */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Document Management{" "}
                <span className="text-indigo-600">Simplified</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
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
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Easy Submission
                </h3>
                <p className="mt-2 text-gray-600">
                  Submit documents quickly and easily with our intuitive
                  interface.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Efficient Approval
                </h3>
                <p className="mt-2 text-gray-600">
                  Streamlined approval process with role-based access control.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Track Progress
                </h3>
                <p className="mt-2 text-gray-600">
                  Monitor document status and track approval progress in
                  real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

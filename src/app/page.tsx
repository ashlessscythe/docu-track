import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect authenticated users to their appropriate dashboard
    switch (session.user.role) {
      case "ADMIN":
        redirect("/admin");
      case "APPROVER":
        redirect("/approver");
      case "SUBMITTER":
        redirect("/submitter");
      default:
        redirect("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to DocuTrack
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A secure document tracking and approval system for managing your
          organization's documents.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Submit Documents</h3>
          <p className="mt-2 text-gray-600">
            Easily submit documents for review and track their approval status
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Review & Approve</h3>
          <p className="mt-2 text-gray-600">
            Efficiently review and approve documents within your department
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold">Secure & Organized</h3>
          <p className="mt-2 text-gray-600">
            Keep your documents secure and organized with role-based access
            control
          </p>
        </div>
      </div>
    </main>
  );
}

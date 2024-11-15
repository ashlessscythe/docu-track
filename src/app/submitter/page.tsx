import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SubmitterDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (!["SUBMITTER", "ADMIN"].includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Submitter Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/api/auth/signout">Sign Out</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Submit Document</h2>
          <p className="text-gray-600">Upload a new document for review</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
          <p className="text-gray-600">Track your document submissions</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Submission History</h2>
          <p className="text-gray-600">View past document submissions</p>
        </div>
      </div>
    </div>
  );
}

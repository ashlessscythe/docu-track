import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ApproverDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (!["APPROVER", "ADMIN"].includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Approver Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/api/auth/signout">Sign Out</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>
          <p className="text-gray-600">Documents awaiting your review</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Approved Documents</h2>
          <p className="text-gray-600">Previously approved documents</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
          <p className="text-gray-600">View department document statistics</p>
        </div>
      </div>
    </div>
  );
}

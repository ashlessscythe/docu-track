import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  // Pending users should be redirected to pending page
  if (session.user.role === "PENDING") {
    redirect("/pending");
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          Welcome to DocuTrack. You are logged in as a{" "}
          {session.user.role.toLowerCase()} user.
        </p>
        <p className="text-gray-600">
          Use the navigation links above to access your available features.
        </p>
      </div>
    </>
  );
}

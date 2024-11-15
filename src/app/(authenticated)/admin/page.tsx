import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          Welcome to the admin dashboard. Here you can manage users and system
          settings.
        </p>
      </div>
    </>
  );
}

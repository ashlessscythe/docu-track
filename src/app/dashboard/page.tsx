import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Redirect to role-specific dashboard
  switch (session.user.role) {
    case "ADMIN":
      redirect("/admin");
    case "APPROVER":
      redirect("/approver");
    case "SUBMITTER":
      redirect("/submitter");
    default:
      return null;
  }
}

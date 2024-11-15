import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== UserRole.PENDING) {
    // If user is not pending, redirect them to their appropriate dashboard
    switch (session.user.role) {
      case UserRole.ADMIN:
        redirect("/admin");
        break;
      case UserRole.APPROVER:
        redirect("/approver");
        break;
      case UserRole.SUBMITTER:
        redirect("/submitter");
        break;
      default:
        redirect("/");
    }
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        Account Pending Approval
      </h1>
      <div className="text-gray-600">
        <p className="mb-4">
          Your account is currently pending administrator approval. You will be
          notified once your account has been approved.
        </p>
        <p>
          Please check back later or contact your administrator if you have any
          questions.
        </p>
      </div>
    </>
  );
}

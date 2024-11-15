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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-muted p-8 rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-primary">
          Account Pending Approval
        </h1>
        <div className="text-primary space-y-4">
          <p>
            Your account is currently pending administrator approval. Once
            approved, you will be:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Assigned to a department</li>
            <li>Given appropriate access permissions</li>
            <li>Able to submit and manage documents</li>
          </ul>
          <p>You will be notified once your account has been approved.</p>
          <div className="mt-6 p-4 bg-background rounded-md border border-border">
            <ul className="list-disc pl-5 space-y-2 text-foreground">
              <li>Ensure your profile information is accurate</li>
              <li>Review the system documentation</li>
              <li>Contact your administrator if you have any questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

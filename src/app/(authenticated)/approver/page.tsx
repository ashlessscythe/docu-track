"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ApproverDashboard } from "@/components/ApproverDashboard";

export default function ApproverPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/signin");
  }

  if (session.user.role !== "APPROVER" && session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          {session.user.role === "ADMIN"
            ? "All Documents"
            : "Department Documents"}
        </h1>
      </div>
      <ApproverDashboard />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ReportStats = {
  users: {
    total: number;
    byRole: {
      ADMIN: number;
      APPROVER: number;
      SUBMITTER: number;
      PENDING: number;
    };
  };
  documents: {
    total: number;
    byStatus: {
      PENDING: number;
      APPROVED: number;
      REJECTED: number;
      NEEDS_REVIEW: number;
    };
    byDepartment: Record<string, number>;
  };
  departments: {
    total: number;
    documentsPerDepartment: Record<string, number>;
    usersPerDepartment: Record<string, number>;
  };
};

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">Failed to load statistics</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Reports</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Total Users:</dt>
                <dd>{stats.users.total}</dd>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <dt>Admins:</dt>
                  <dd>{stats.users.byRole.ADMIN}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Approvers:</dt>
                  <dd>{stats.users.byRole.APPROVER}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Submitters:</dt>
                  <dd>{stats.users.byRole.SUBMITTER}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Pending:</dt>
                  <dd>{stats.users.byRole.PENDING}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Document Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Document Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Total Documents:</dt>
                <dd>{stats.documents.total}</dd>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <dt>Pending:</dt>
                  <dd>{stats.documents.byStatus.PENDING}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Approved:</dt>
                  <dd>{stats.documents.byStatus.APPROVED}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Rejected:</dt>
                  <dd>{stats.documents.byStatus.REJECTED}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt>Needs Review:</dt>
                  <dd>{stats.documents.byStatus.NEEDS_REVIEW}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Total Departments:</dt>
                <dd>{stats.departments.total}</dd>
              </div>
              <div className="pt-2 space-y-1">
                {Object.entries(stats.departments.documentsPerDepartment).map(
                  ([dept, count]) => (
                    <div key={dept} className="flex justify-between text-sm">
                      <dt>{dept}:</dt>
                      <dd>{count} docs</dd>
                    </div>
                  )
                )}
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

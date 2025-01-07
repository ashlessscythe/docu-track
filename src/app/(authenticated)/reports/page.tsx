"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface DocumentStats {
  department: string | null;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  needsReview: number;
}

interface DailyStats {
  day: number;
  total: number;
  APPROVED: number;
  PENDING: number;
  REJECTED: number;
  NEEDS_REVIEW: number;
}

export default function ReportsPage() {
  const [deptData, setDeptData] = React.useState<DocumentStats[]>([]);
  const [monthlyData, setMonthlyData] = React.useState<DailyStats[]>([]);
  const [deptLoading, setDeptLoading] = React.useState(true);
  const [monthlyLoading, setMonthlyLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Fetch department data only on initial load
  React.useEffect(() => {
    const fetchDeptData = async () => {
      try {
        setDeptLoading(true);
        const response = await fetch(
          "/api/admin/reports/documents-by-department"
        );
        if (!response.ok) throw new Error("Failed to fetch department data");
        const stats = await response.json();
        setDeptData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDeptData();
  }, []);

  // Fetch monthly data when month changes
  React.useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setMonthlyLoading(true);
        const [year, month] = selectedMonth.split("-");
        const response = await fetch(
          `/api/admin/reports/monthly-documents?month=${month}&year=${year}`
        );
        if (!response.ok) throw new Error("Failed to fetch monthly data");
        const stats = await response.json();
        setMonthlyData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setMonthlyLoading(false);
      }
    };
    fetchMonthlyData();
  }, [selectedMonth]);

  if (error) return <div>Error: {error}</div>;

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      value: `2024-${String(i + 1).padStart(2, "0")}`,
      label: date.toLocaleString("default", { month: "long" }),
    };
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Document Analytics</h1>

      <Card className={isMaximized ? "fixed inset-4 z-50 overflow-auto" : ""}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents by Department</CardTitle>
            <CardDescription>
              Breakdown of document statuses across departments
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {deptLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              Loading department data...
            </div>
          ) : (
            <div
              className={isMaximized ? "h-[calc(100vh-200px)]" : "h-[400px]"}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deptData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="department"
                    tickFormatter={(value) =>
                      value === null ? "Global" : value
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="approved"
                    stackId="a"
                    fill="#4ade80"
                    name="Approved"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#fbbf24"
                    name="Pending"
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill="#ef4444"
                    name="Rejected"
                  />
                  <Bar
                    dataKey="needsReview"
                    stackId="a"
                    fill="#60a5fa"
                    name="Needs Review"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Document Activity</CardTitle>
            <CardDescription>
              Daily document submissions and their statuses
            </CardDescription>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] text-foreground bg-background border border-border shadow-lg rounded-md">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="border border-border text-foreground bg-background shadow-sm rounded-md">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {monthlyLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              Loading monthly data...
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="APPROVED"
                    stroke="#4ade80"
                    name="Approved"
                  />
                  <Line
                    type="monotone"
                    dataKey="PENDING"
                    stroke="#fbbf24"
                    name="Pending"
                  />
                  <Line
                    type="monotone"
                    dataKey="REJECTED"
                    stroke="#ef4444"
                    name="Rejected"
                  />
                  <Line
                    type="monotone"
                    dataKey="NEEDS_REVIEW"
                    stroke="#60a5fa"
                    name="Needs Review"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {!deptLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {deptData.map((dept) => (
            <Card key={dept.department ?? "global"}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {dept.department ?? "Global (No dept)"}
                </CardTitle>
                <CardDescription>Document Statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt>Total Documents:</dt>
                    <dd className="font-semibold">{dept.total}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Approved:</dt>
                    <dd className="text-green-600 font-semibold">
                      {dept.approved}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Pending:</dt>
                    <dd className="text-yellow-600 font-semibold">
                      {dept.pending}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Rejected:</dt>
                    <dd className="text-red-600 font-semibold">
                      {dept.rejected}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Needs Review:</dt>
                    <dd className="text-blue-600 font-semibold">
                      {dept.needsReview}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

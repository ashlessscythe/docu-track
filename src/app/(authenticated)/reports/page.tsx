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
import { KpiCard } from "@/components/reports/kpi-card";
import { StatusDistributionChart } from "@/components/reports/status-distribution-chart";
import { ApprovalRateChart } from "@/components/reports/approval-rate-chart";
import { MonthlyTrendChart } from "@/components/reports/monthly-trend-chart";
import {
  STATUS_COLORS,
  STATUS_API_COLORS,
  generateMonthOptions,
} from "@/components/reports/chart-colors";
import {
  useChartBreakpoint,
  chartMargins,
  chartTickSize,
  categoryAxisProps,
  legendProps,
} from "@/components/reports/chart-utils";

interface DocumentStats {
  department: string | null;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  needsReview: number;
}

interface DocumentTypeStats {
  type: string;
  typeId: string;
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

interface ExecutiveSummary {
  kpis: {
    totalDocuments: number;
    approvalRate: number;
    rejectionRate: number;
    activeBacklog: number;
    avgProcessingDays: number | null;
    momChange: {
      submissions: number;
      approvalRate: number;
    };
  };
  statusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  approvalRateByDepartment: {
    department: string;
    rate: number;
    total: number;
  }[];
  monthlyTrends: {
    month: string;
    submissions: number;
    approvalRate: number;
  }[];
}

function BreakdownTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry) => {
        const pct =
          total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
        return (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value} ({pct}%)
          </p>
        );
      })}
      <p className="text-sm font-medium mt-2 border-t pt-2">Total: {total}</p>
    </div>
  );
}

export default function ReportsPage() {
  const [executiveSummary, setExecutiveSummary] =
    React.useState<ExecutiveSummary | null>(null);
  const [deptData, setDeptData] = React.useState<DocumentStats[]>([]);
  const [typeData, setTypeData] = React.useState<DocumentTypeStats[]>([]);
  const [monthlyData, setMonthlyData] = React.useState<DailyStats[]>([]);
  const [summaryLoading, setSummaryLoading] = React.useState(true);
  const [deptLoading, setDeptLoading] = React.useState(true);
  const [typeLoading, setTypeLoading] = React.useState(true);
  const [monthlyLoading, setMonthlyLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeptMaximized, setIsDeptMaximized] = React.useState(false);
  const [isTypeMaximized, setIsTypeMaximized] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const months = React.useMemo(() => generateMonthOptions(24), []);
  const chartBreakpoint = useChartBreakpoint();
  const chartTick = { fontSize: chartTickSize(chartBreakpoint) };
  const xAxisProps = categoryAxisProps(chartBreakpoint);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await fetch("/api/admin/reports/executive-summary");
        if (!response.ok) throw new Error("Failed to fetch executive summary");
        const data = await response.json();
        setExecutiveSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
  }, []);

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

  React.useEffect(() => {
    const fetchTypeData = async () => {
      try {
        setTypeLoading(true);
        const response = await fetch("/api/admin/reports/documents-by-type");
        if (!response.ok) throw new Error("Failed to fetch document type data");
        const stats = await response.json();
        setTypeData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setTypeLoading(false);
      }
    };
    fetchTypeData();
  }, []);

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

  const kpis = executiveSummary?.kpis;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Document workflow performance at a glance
        </p>
      </div>

      {/* Executive KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Documents"
          value={kpis?.totalDocuments ?? 0}
          trend={kpis?.momChange.submissions}
          trendLabel="submissions vs last month"
          loading={summaryLoading}
        />
        <KpiCard
          title="Approval Rate"
          value={kpis ? `${kpis.approvalRate.toFixed(1)}%` : "0%"}
          trend={kpis?.momChange.approvalRate}
          trendLabel="vs last month"
          trendIsPoints
          loading={summaryLoading}
        />
        <KpiCard
          title="Active Backlog"
          value={kpis?.activeBacklog ?? 0}
          description="Pending + needs review"
          loading={summaryLoading}
        />
        <KpiCard
          title="Avg Processing Time"
          value={
            kpis?.avgProcessingDays != null
              ? `${kpis.avgProcessingDays} days`
              : "N/A"
          }
          description="For approved documents"
          loading={summaryLoading}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>
              Current document status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <StatusDistributionChart
                data={executiveSummary?.statusDistribution ?? []}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval Rate by Department</CardTitle>
            <CardDescription>
              Sorted by rate — highlights bottlenecks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <ApprovalRateChart
                data={executiveSummary?.approvalRateByDepartment ?? []}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 6-Month Trend */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>6-Month Trend</CardTitle>
          <CardDescription>
            Submission volume and approval rate over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="h-[350px] flex items-center justify-center">
              Loading trend data...
            </div>
          ) : (
            <MonthlyTrendChart
              data={executiveSummary?.monthlyTrends ?? []}
            />
          )}
        </CardContent>
      </Card>

      {/* Daily Drill-Down */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>
              Daily document submissions and their statuses
            </CardDescription>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px] text-foreground bg-background border border-border shadow-lg rounded-md">
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
              Loading daily data...
            </div>
          ) : monthlyData.every((d) => d.total === 0) ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No documents submitted in this period
            </div>
          ) : (
            <div className="h-[320px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart
                  data={monthlyData}
                  margin={chartMargins(chartBreakpoint)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={chartTick} />
                  <YAxis tick={chartTick} width={chartBreakpoint === "sm" ? 32 : 48} />
                  <Tooltip contentStyle={{ fontSize: chartTickSize(chartBreakpoint) }} />
                  <Legend {...legendProps(chartBreakpoint)} />
                  <Line
                    type="monotone"
                    dataKey="APPROVED"
                    stroke={STATUS_API_COLORS.APPROVED}
                    name="Approved"
                  />
                  <Line
                    type="monotone"
                    dataKey="PENDING"
                    stroke={STATUS_API_COLORS.PENDING}
                    name="Pending"
                  />
                  <Line
                    type="monotone"
                    dataKey="REJECTED"
                    stroke={STATUS_API_COLORS.REJECTED}
                    name="Rejected"
                  />
                  <Line
                    type="monotone"
                    dataKey="NEEDS_REVIEW"
                    stroke={STATUS_API_COLORS.NEEDS_REVIEW}
                    name="Needs Review"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents by Department */}
      <Card
        className={`mb-8 ${isDeptMaximized ? "fixed inset-4 z-50 overflow-auto" : ""}`}
      >
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
            onClick={() => setIsDeptMaximized(!isDeptMaximized)}
          >
            {isDeptMaximized ? (
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
          ) : deptData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No department data available
            </div>
          ) : (
            <div
              className={
                isDeptMaximized
                  ? "h-[calc(100vh-200px)]"
                  : "h-[320px] sm:h-[400px]"
              }
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={deptData.map((d) => ({ ...d, total: d.total }))}
                  margin={chartMargins(chartBreakpoint, {
                    bottom: xAxisProps.height,
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="department"
                    tick={xAxisProps.tick}
                    angle={xAxisProps.angle}
                    textAnchor={xAxisProps.textAnchor}
                    height={xAxisProps.height}
                    interval={xAxisProps.interval}
                    tickFormatter={(value) =>
                      value === null ? "Global" : value
                    }
                  />
                  <YAxis tick={chartTick} width={chartBreakpoint === "sm" ? 32 : 48} />
                  <Tooltip content={<BreakdownTooltip />} />
                  <Legend {...legendProps(chartBreakpoint)} />
                  <Bar
                    dataKey="approved"
                    stackId="a"
                    fill={STATUS_COLORS.approved}
                    name="Approved"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill={STATUS_COLORS.pending}
                    name="Pending"
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill={STATUS_COLORS.rejected}
                    name="Rejected"
                  />
                  <Bar
                    dataKey="needsReview"
                    stackId="a"
                    fill={STATUS_COLORS.needsReview}
                    name="Needs Review"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents by Type */}
      <Card
        className={isTypeMaximized ? "fixed inset-4 z-50 overflow-auto" : ""}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents by Type</CardTitle>
            <CardDescription>
              Breakdown of document statuses across document types
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTypeMaximized(!isTypeMaximized)}
          >
            {isTypeMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {typeLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              Loading document type data...
            </div>
          ) : typeData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No document type data available
            </div>
          ) : (
            <div
              className={
                isTypeMaximized
                  ? "h-[calc(100vh-200px)]"
                  : "h-[320px] sm:h-[400px]"
              }
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={typeData.map((d) => ({ ...d, total: d.total }))}
                  margin={chartMargins(chartBreakpoint, {
                    bottom: xAxisProps.height,
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    tick={xAxisProps.tick}
                    angle={xAxisProps.angle}
                    textAnchor={xAxisProps.textAnchor}
                    height={xAxisProps.height}
                    interval={xAxisProps.interval}
                  />
                  <YAxis tick={chartTick} width={chartBreakpoint === "sm" ? 32 : 48} />
                  <Tooltip content={<BreakdownTooltip />} />
                  <Legend {...legendProps(chartBreakpoint)} />
                  <Bar
                    dataKey="approved"
                    stackId="a"
                    fill={STATUS_COLORS.approved}
                    name="Approved"
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill={STATUS_COLORS.pending}
                    name="Pending"
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill={STATUS_COLORS.rejected}
                    name="Rejected"
                  />
                  <Bar
                    dataKey="needsReview"
                    stackId="a"
                    fill={STATUS_COLORS.needsReview}
                    name="Needs Review"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

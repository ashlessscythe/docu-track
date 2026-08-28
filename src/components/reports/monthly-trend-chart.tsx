"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPercent } from "./chart-colors";

interface MonthlyTrendItem {
  month: string;
  submissions: number;
  approvalRate: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyTrendItem[];
  height?: number;
}

export function MonthlyTrendChart({
  data,
  height = 350,
}: MonthlyTrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          yAxisId="left"
          orientation="left"
          label={{
            value: "Submissions",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          label={{
            value: "Approval Rate",
            angle: 90,
            position: "insideRight",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "Approval Rate") return [formatPercent(value), name];
            return [value, name];
          }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="submissions"
          fill="#60a5fa"
          name="Submissions"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="approvalRate"
          stroke="#4ade80"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Approval Rate"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

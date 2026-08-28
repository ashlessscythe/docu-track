"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatPercent } from "./chart-colors";

interface ApprovalRateItem {
  department: string;
  rate: number;
  total: number;
}

interface ApprovalRateChartProps {
  data: ApprovalRateItem[];
  height?: number;
}

function rateColor(rate: number): string {
  if (rate >= 75) return "#4ade80";
  if (rate >= 50) return "#fbbf24";
  return "#ef4444";
}

export function ApprovalRateChart({
  data,
  height = 300,
}: ApprovalRateChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        No department data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="department"
          width={120}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number, _name, props) => {
            const total = props.payload?.total ?? 0;
            return [`${formatPercent(value)} (${total} docs)`, "Approval Rate"];
          }}
        />
        <Bar dataKey="rate" name="Approval Rate" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.department} fill={rateColor(entry.rate)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

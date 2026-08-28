import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  trendIsPoints?: boolean;
  loading?: boolean;
}

function TrendIndicator({
  trend,
  label,
  isPoints,
}: {
  trend: number;
  label?: string;
  isPoints?: boolean;
}) {
  const formatted = isPoints
    ? `${trend >= 0 ? "+" : ""}${trend.toFixed(1)} pts`
    : `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`;

  if (trend === 0) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Minus className="h-4 w-4" />
        <span>{label ?? "No change vs last month"}</span>
      </div>
    );
  }

  const isPositive = trend > 0;
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm",
        isPositive ? "text-green-600" : "text-red-600"
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span>
        {formatted} {label ?? "vs last month"}
      </span>
    </div>
  );
}

export function KpiCard({
  title,
  value,
  description,
  trend,
  trendLabel,
  trendIsPoints,
  loading,
}: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">
          {loading ? (
            <span className="inline-block h-9 w-24 animate-pulse rounded bg-muted" />
          ) : (
            value
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-1">{description}</p>
        )}
        {!loading && trend !== undefined && (
          <TrendIndicator
            trend={trend}
            label={trendLabel}
            isPoints={trendIsPoints}
          />
        )}
      </CardContent>
    </Card>
  );
}

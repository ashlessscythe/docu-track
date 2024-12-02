"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function NotFound() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "The requested page";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <h2 className="text-2xl font-bold tracking-tight">
        {from} is not available yet
      </h2>
      <p className="text-muted-foreground max-w-[500px]">
        We&apos;re working hard to bring you this feature. Please check back
        later or return to the dashboard.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}

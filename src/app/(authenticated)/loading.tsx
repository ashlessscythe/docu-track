export default function AuthenticatedLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="space-y-4 w-full max-w-4xl">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg border bg-muted/50" />
      </div>
    </div>
  );
}

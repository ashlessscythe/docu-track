import { Header } from "@/components/Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="rounded-lg bg-background border shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}

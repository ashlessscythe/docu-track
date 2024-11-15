import { Header } from "@/components/Header";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl p-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
      </main>
    </div>
  );
}

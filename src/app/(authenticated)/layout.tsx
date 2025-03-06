import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions, sessionHasError } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (await sessionHasError(session))) {
    redirect("/signin");
  }
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

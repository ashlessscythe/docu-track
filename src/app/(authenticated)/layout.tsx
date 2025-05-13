import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Get the user from Stack Auth, redirect to sign-in if not authenticated
    await stackServerApp.getUser({ or: "redirect" });

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
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/handler/sign-in");
  }
}

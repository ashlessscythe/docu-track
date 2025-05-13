import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentsTable } from "@/components/DocumentsTable";
import { Header } from "@/components/Header";
import { stackServerApp } from "@/stack";

export const metadata: Metadata = {
  title: "Documents | Admin",
  description: "View and manage all documents in the system",
};

export default async function DocumentsPage() {
  // Get the user from Stack Auth, redirect to sign-in if not authenticated
  const user = await stackServerApp.getUser({ or: "redirect" });

  // Check if user has ADMIN permission
  const isAdmin = await user.getPermission("ADMIN");

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  const [documents, departments, documentTypes] = await Promise.all([
    prisma.document.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        department: true,
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.department.findMany(),
    prisma.documentType.findMany(),
  ]);

  return (
    <>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage all submitted documents
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {documents.length} documents
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DocumentsTable
              initialDocuments={documents}
              departments={departments}
              documentTypes={documentTypes}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentsTable } from "@/components/DocumentsTable";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Documents | Admin",
  description: "View and manage all documents in the system",
};

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
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

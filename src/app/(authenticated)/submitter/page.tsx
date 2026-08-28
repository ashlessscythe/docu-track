"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DocumentsTableSkeleton } from "@/components/shared/DocumentsTableSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import dynamic from "next/dynamic";

const SubmitDocumentDialog = dynamic(
  () =>
    import("@/components/SubmitDocumentDialog").then((m) => ({
      default: m.SubmitDocumentDialog,
    })),
  { loading: () => null }
);

const ViewDocumentDialog = dynamic(
  () =>
    import("@/components/ViewDocumentDialog").then((m) => ({
      default: m.ViewDocumentDialog,
    })),
  { loading: () => null }
);
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface Department {
  id: string;
  name: string;
  description: string | null;
}

interface DocumentType {
  id: string;
  name: string;
  description: string | null;
}

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  department: Department | null;
  status: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function SubmitterPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const router = useRouter();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents/user");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/unauthorized");
          return;
        }
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-destructive/10 border-destructive/20 border p-4 text-destructive">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">My Documents</h1>
        <SubmitDocumentDialog onSuccess={fetchDocuments} />
      </div>

      {loading ? (
        <DocumentsTableSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow className="border-b">
                    <TableHead className="w-[200px] font-semibold bg-background">
                      Name
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold bg-background">
                      Type
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold bg-background">
                      Department
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold bg-background">
                      Status
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold bg-background">
                      Submitted
                    </TableHead>
                    <TableHead className="w-[80px] text-right font-semibold bg-background">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type.name}</TableCell>
                      <TableCell>{doc.department?.name ?? "Pending"}</TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No documents submitted yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="text-sm font-medium">{doc.type.name}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Department
                      </div>
                      <div className="text-sm font-medium">
                        {doc.department?.name ?? "Pending"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-sm">
                        <StatusBadge status={doc.status} />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Submitted
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(doc.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setViewDialogOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {documents.length === 0 && (
                <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                  No documents submitted yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDoc && viewDialogOpen && (
        <ViewDocumentDialog
          document={selectedDoc}
          onDocumentUpdate={fetchDocuments}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
    </div>
  );
}

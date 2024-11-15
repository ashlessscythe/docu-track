"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SubmitDocumentDialog } from "@/components/SubmitDocumentDialog";
import { ViewDocumentDialog } from "@/components/ViewDocumentDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  department: string;
  status: string;
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "text-emerald-600 dark:text-emerald-400 font-semibold";
    case "REJECTED":
      return "text-destructive font-semibold";
    case "NEEDS_REVIEW":
      return "text-primary font-semibold";
    default:
      return "text-primary font-semibold";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "NEEDS_REVIEW":
      return "NEEDS REVIEW";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

function DocumentsTableSkeleton() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[140px]">Department</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Submitted</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SubmitterPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents");
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
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-semibold">Name</TableHead>
                <TableHead className="w-[120px] font-semibold">Type</TableHead>
                <TableHead className="w-[140px] font-semibold">
                  Department
                </TableHead>
                <TableHead className="w-[120px] font-semibold">
                  Status
                </TableHead>
                <TableHead className="w-[120px] font-semibold">
                  Submitted
                </TableHead>
                <TableHead className="w-[80px] text-right font-semibold">
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
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.department}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block ${getStatusColor(doc.status)}`}
                    >
                      {formatStatus(doc.status)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(doc.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <ViewDocumentDialog
                      document={doc}
                      onDocumentUpdate={fetchDocuments}
                    />
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
      )}
    </div>
  );
}

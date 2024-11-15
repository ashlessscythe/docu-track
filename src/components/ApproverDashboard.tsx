import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ViewDocumentDialog } from "./ViewDocumentDialog";
import { DocumentWithRelations, DocumentStatus } from "@/types/documents";

type ViewDocumentType = {
  id: string;
  name: string;
  type: DocumentWithRelations["type"];
  description: string;
  department: DocumentWithRelations["department"];
  status: string;
  createdAt: string;
};

function DocumentsTableSkeleton() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[140px]">Submitter</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Submitted</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
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
              <TableCell>
                <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ApproverDashboard() {
  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ViewDocumentType | null>(null);
  const [actionDoc, setActionDoc] = useState<DocumentWithRelations | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents/department");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (
    documentId: string,
    status: DocumentStatus
  ) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update document status");

      const updatedDoc = await response.json();
      setDocuments((docs) =>
        docs.map((doc) => (doc.id === documentId ? updatedDoc : doc))
      );
      setActionDialogOpen(false);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
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

  const formatStatus = (status: DocumentStatus) => {
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

  const formatDocumentForView = (
    doc: DocumentWithRelations
  ): ViewDocumentType => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    description: doc.description,
    department: doc.department,
    status: doc.status,
    createdAt: doc.createdAt,
  });

  const handleDocumentClick = (doc: DocumentWithRelations) => {
    if (doc.status === "PENDING") {
      setActionDoc(doc);
      setActionDialogOpen(true);
    } else {
      setSelectedDoc(formatDocumentForView(doc));
      setViewDialogOpen(true);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-destructive/10 border-destructive/20 border p-4 text-destructive">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return <DocumentsTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-semibold">Name</TableHead>
            <TableHead className="w-[120px] font-semibold">Type</TableHead>
            <TableHead className="w-[140px] font-semibold">Submitter</TableHead>
            <TableHead className="w-[120px] font-semibold">Status</TableHead>
            <TableHead className="w-[120px] font-semibold">Submitted</TableHead>
            <TableHead className="w-[100px] text-right font-semibold">
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
              <TableCell>{doc.submitter.name}</TableCell>
              <TableCell>
                <span className={getStatusColor(doc.status)}>
                  {formatStatus(doc.status)}
                </span>
              </TableCell>
              <TableCell>{formatDate(doc.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDocumentClick(doc)}
                >
                  {doc.status === "PENDING" ? "Actions" : "View"}
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
                No documents to review
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedDoc && viewDialogOpen && (
        <ViewDocumentDialog
          document={selectedDoc}
          onDocumentUpdate={fetchDocuments}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Document
                </h4>
                <p className="mt-1">{actionDoc?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Submitter
                </h4>
                <p className="mt-1">{actionDoc?.submitter.name}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() =>
                  actionDoc && updateDocumentStatus(actionDoc.id, "APPROVED")
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve Document
              </Button>
              <Button
                onClick={() =>
                  actionDoc && updateDocumentStatus(actionDoc.id, "REJECTED")
                }
                variant="destructive"
              >
                Reject Document
              </Button>
              <Button
                onClick={() =>
                  actionDoc &&
                  updateDocumentStatus(actionDoc.id, "NEEDS_REVIEW")
                }
                variant="secondary"
              >
                Request Review
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActionDialogOpen(false);
                  if (actionDoc) {
                    setSelectedDoc(formatDocumentForView(actionDoc));
                    setViewDialogOpen(true);
                  }
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

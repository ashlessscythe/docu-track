"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentsTableSkeleton } from "@/components/shared/DocumentsTableSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ViewDocumentDialog } from "@/components/ViewDocumentDialog";
import { DocumentWithRelations, DocumentStatus } from "@/types/documents";
import { ArrowUpDown, Search, X } from "lucide-react";

type ViewDocumentType = {
  id: string;
  name: string;
  type: DocumentWithRelations["type"];
  description: string;
  department: DocumentWithRelations["department"];
  status: string;
  createdAt: string;
};

type SortConfig = {
  key: keyof DocumentWithRelations | null;
  direction: "asc" | "desc";
};

type DocumentType = {
  id: string;
  name: string;
  description: string | null;
  siteId: string | null;
};

export default function ApproverPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    DocumentWithRelations[]
  >([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ViewDocumentType | null>(null);
  const [actionDoc, setActionDoc] = useState<DocumentWithRelations | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>("");

  // Sorting and filtering states
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");

  const fetchDepartmentName = useCallback(async () => {
    if (!session?.user.departmentId) return;

    try {
      const response = await fetch(
        `/api/departments/${session.user.departmentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch department");
      const data = await response.json();
      setDepartmentName(data.name);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  }, [session?.user.departmentId]);

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch("/api/document-types");
      if (!response.ok) throw new Error("Failed to fetch document types");
      const data = await response.json();
      setDocumentTypes(data);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents/department");
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "APPROVER" && session.user.role !== "ADMIN") {
        redirect("/unauthorized");
        return;
      }
      fetchDocuments();
      fetchDepartmentName();
      fetchDocumentTypes();
    }
  }, [status, session?.user.role, fetchDepartmentName]);

  // Apply filters and sorting to documents
  useEffect(() => {
    let result = [...documents];

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((doc) => doc.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "ALL") {
      result = result.filter((doc) => doc.type.id === typeFilter);
    }

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchLower) ||
          doc.submitter.name.toLowerCase().includes(searchLower) ||
          doc.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle nested properties
        if (sortConfig.key === "type") {
          aValue = a.type.name;
          bValue = b.type.name;
        } else if (sortConfig.key === "submitter") {
          aValue = a.submitter.name;
          bValue = b.submitter.name;
        } else {
          aValue = a[sortConfig.key as keyof typeof a];
          bValue = b[sortConfig.key as keyof typeof b];
        }

        // Handle date comparison
        if (sortConfig.key === "createdAt") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredDocuments(result);
  }, [documents, statusFilter, typeFilter, searchText, sortConfig]);

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
      setSelectedDoc(null);
      setActionDialogOpen(true);
    } else {
      setActionDoc(null);
      setSelectedDoc(formatDocumentForView(doc));
      setViewDialogOpen(true);
    }
  };

  const handleSort = (key: keyof DocumentWithRelations) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const resetFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSearchText("");
    setSortConfig({ key: null, direction: "desc" });
  };

  if (status === "loading") {
    return <DocumentsTableSkeleton />;
  }

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
        <h1 className="text-3xl font-semibold tracking-tight">
          {session.user.role === "ADMIN"
            ? "All Documents"
            : `${departmentName} Department Documents`}
        </h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Search documents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-3 top-3"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="border border-border shadow-md rounded-md bg-background text-foreground">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="border border-border shadow-md rounded-md bg-background text-foreground">
            <SelectItem value="ALL">All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" /> Clear Filters
        </Button>
      </div>

      {loading ? (
        <DocumentsTableSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-hidden">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow className="border-b">
                    <TableHead
                      className="w-[200px] font-semibold cursor-pointer bg-background"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        {sortConfig.key === "name" && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[120px] font-semibold cursor-pointer bg-background"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        {sortConfig.key === "type" && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[140px] font-semibold cursor-pointer bg-background"
                      onClick={() => handleSort("submitter")}
                    >
                      <div className="flex items-center">
                        Submitter
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        {sortConfig.key === "submitter" && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[120px] font-semibold cursor-pointer bg-background"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        {sortConfig.key === "status" && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[120px] font-semibold cursor-pointer bg-background"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Submitted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        {sortConfig.key === "createdAt" && (
                          <span className="ml-1 text-xs">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-right font-semibold bg-background">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type.name}</TableCell>
                      <TableCell>{doc.submitter.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
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
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No documents match your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto space-y-4">
              {filteredDocuments.map((doc) => (
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
                        Submitter
                      </div>
                      <div className="text-sm font-medium">
                        {doc.submitter.name}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Status
                      </div>
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
                      onClick={() => handleDocumentClick(doc)}
                    >
                      {doc.status === "PENDING" ? "Actions" : "View"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {filteredDocuments.length === 0 && (
                <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                  No documents match your filters
                </div>
              )}
            </div>
          </div>

          {selectedDoc && viewDialogOpen && (
            <ViewDocumentDialog
              document={selectedDoc}
              onDocumentUpdate={fetchDocuments}
              open={viewDialogOpen}
              onOpenChange={(open) => {
                setViewDialogOpen(open);
                if (!open && !actionDialogOpen) {
                  // Reset selectedDoc and actionDoc when closing the dialog
                  setSelectedDoc(null);
                  setActionDoc(null);
                }
              }}
              onBackToActions={
                actionDoc && actionDoc.status === "PENDING"
                  ? () => setActionDialogOpen(true)
                  : undefined
              }
            />
          )}

          <Dialog
            open={actionDialogOpen}
            onOpenChange={(open) => {
              setActionDialogOpen(open);
              if (!open && !viewDialogOpen) {
                // Reset actionDoc when closing the dialog if not going to view details
                setActionDoc(null);
              }
            }}
          >
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
                      actionDoc &&
                      updateDocumentStatus(actionDoc.id, "APPROVED")
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Approve Document
                  </Button>
                  <Button
                    onClick={() =>
                      actionDoc &&
                      updateDocumentStatus(actionDoc.id, "REJECTED")
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
      )}
    </div>
  );
}

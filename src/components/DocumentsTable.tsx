"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Department, DocumentStatus, DocumentType } from "@prisma/client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type DocumentWithRelations = {
  id: string;
  name: string;
  description: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  type: DocumentType;
  department: Department | null;
  submitter: {
    id: string;
    name: string;
    email: string;
  };
  approver: {
    id: string;
    name: string;
    email: string;
  } | null;
};

interface DocumentsTableProps {
  initialDocuments: DocumentWithRelations[];
  departments: Department[];
  documentTypes: DocumentType[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    case "APPROVED":
      return "text-green-600 bg-green-50 px-2 py-1 rounded";
    case "REJECTED":
      return "text-red-600 bg-red-50 px-2 py-1 rounded";
    case "NEEDS_REVIEW":
      return "text-blue-600 bg-blue-50 px-2 py-1 rounded";
    default:
      return "text-gray-600";
  }
}

const ALL_VALUE = "all";

export function DocumentsTable({
  initialDocuments,
  departments,
  documentTypes,
}: DocumentsTableProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    DocumentStatus | typeof ALL_VALUE
  >(ALL_VALUE);
  const [departmentFilter, setDepartmentFilter] = useState(ALL_VALUE);
  const [typeFilter, setTypeFilter] = useState(ALL_VALUE);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc" as "asc" | "desc",
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter !== ALL_VALUE) params.append("status", statusFilter);
    if (departmentFilter !== ALL_VALUE)
      params.append("departmentId", departmentFilter);
    if (typeFilter !== ALL_VALUE) params.append("typeId", typeFilter);
    params.append("sortBy", sortConfig.key);
    params.append("sortOrder", sortConfig.direction);

    const response = await fetch(`/api/admin/documents?${params.toString()}`);
    const data = await response.json();
    setDocuments(data);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select
          value={statusFilter}
          onValueChange={(value: DocumentStatus | typeof ALL_VALUE) =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="text-foreground bg-background border border-border shadow-sm rounded-md">
            <SelectItem value={ALL_VALUE}>All Statuses</SelectItem>
            {Object.values(DocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent className="text-foreground bg-background border border-border shadow-sm rounded-md">
            <SelectItem value={ALL_VALUE}>All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="text-foreground bg-background border border-border shadow-sm rounded-md">
            <SelectItem value={ALL_VALUE}>All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                Name {getSortIcon("name")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("type")}
                className="cursor-pointer"
              >
                Type {getSortIcon("type")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("department")}
                className="cursor-pointer"
              >
                Department {getSortIcon("department")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                Status {getSortIcon("status")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("submitter")}
                className="cursor-pointer"
              >
                Submitter {getSortIcon("submitter")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("approver")}
                className="cursor-pointer"
              >
                Approver {getSortIcon("approver")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("createdAt")}
                className="cursor-pointer"
              >
                Submitted {getSortIcon("createdAt")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type.name}</TableCell>
                <TableCell>{doc.department?.name || "N/A"}</TableCell>
                <TableCell>
                  <span className={getStatusColor(doc.status)}>
                    {doc.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{doc.submitter.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {doc.submitter.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {doc.approver ? (
                    <div className="flex flex-col">
                      <span>{doc.approver.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {doc.approver.email}
                      </span>
                    </div>
                  ) : (
                    "Not assigned"
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(doc.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
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
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="text-sm font-medium">
                  {doc.department?.name || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-sm">
                  <span className={getStatusColor(doc.status)}>
                    {doc.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Submitter</div>
                <div className="text-sm font-medium text-right">
                  <div>{doc.submitter.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {doc.submitter.email}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Approver</div>
                <div className="text-sm font-medium text-right">
                  {doc.approver ? (
                    <>
                      <div>{doc.approver.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.approver.email}
                      </div>
                    </>
                  ) : (
                    "Not assigned"
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Submitted</div>
                <div className="text-sm font-medium">
                  {formatDistanceToNow(new Date(doc.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {documents.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
            No documents match your filters
          </div>
        )}
      </div>
    </div>
  );
}

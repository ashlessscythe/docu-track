"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedbackStatus } from "@prisma/client";

type Feedback = {
  id: string;
  content: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export default function FeedbackManagement() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchFeedback = async (page = 1, status: string | null = null) => {
    setLoading(true);
    try {
      let url = `/api/feedback?page=${page}&limit=${pagination.limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();
      setFeedback(data.feedback);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(pagination.page, statusFilter);
  }, [pagination.page, statusFilter]);

  const handleStatusChange = async (
    feedbackId: string,
    newStatus: FeedbackStatus
  ) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback status");
      }

      // Update local state
      setFeedback((prev) =>
        prev.map((item) =>
          item.id === feedbackId ? { ...item, status: newStatus } : item
        )
      );

      toast({
        title: "Success",
        description: "Feedback status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feedback Management</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={statusFilter || "ALL"}
            onValueChange={(value) => {
              setStatusFilter(value === "ALL" ? null : value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="border border-border bg-background text-forground shadow-md rounded-md">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading feedback...</div>
      ) : feedback.length === 0 ? (
        <div className="p-8 text-center">No feedback found</div>
      ) : (
        <>
          {/* Desktop view - Table */}
          <div className="hidden md:block">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="whitespace-normal break-words">
                          {item.content}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : item.status === "REVIEWED"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            handleStatusChange(item.id, value as FeedbackStatus)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border border-border bg-background text-forground shadow-md rounded-md">
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="REVIEWED">Reviewed</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile view - Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {feedback.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.user.email}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : item.status === "REVIEWED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="border-t border-b py-3 my-2">
                    <p className="whitespace-normal break-words">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </div>
                    <Select
                      value={item.status}
                      onValueChange={(value) =>
                        handleStatusChange(item.id, value as FeedbackStatus)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border border-border bg-background text-forground shadow-md rounded-md">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4">
              Page {pagination.page} of {pagination.pages}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.pages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

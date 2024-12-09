"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DocumentCommentsDialog } from "./DocumentCommentsDialog";

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

interface ViewDocumentDialogProps {
  document: {
    id: string;
    name: string;
    type: DocumentType;
    description: string;
    department: Department | null;
    status: string;
    createdAt: string;
    submitterId?: string; // Made optional
  };
  userRole?: string; // Made optional
  userId?: string; // Made optional
  onDocumentUpdate: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDocumentDialog({
  document,
  userRole,
  userId,
  onDocumentUpdate,
  open,
  onOpenChange,
}: ViewDocumentDialogProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchCommentCount();
    }
  }, [open, document.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const comments = await response.json();
      setCommentCount(comments.length);
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/documents/${document.id}/download`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      // Add a system comment for deletion
      await addSystemComment("Document was deleted");

      onOpenChange(false);
      onDocumentUpdate();
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      // Add a system comment for file replacement
      await addSystemComment(`File was replaced with: ${file.name}`);

      // Update document without closing dialogs
      onDocumentUpdate();
      fetchCommentCount(); // Refresh comment count
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Status update failed");

      // Add a system comment for status change
      await addSystemComment(`Document status changed to: ${newStatus}`);

      // If status is changed to NEEDS_REVIEW, open comments dialog
      if (newStatus === "NEEDS_REVIEW") {
        setShowCommentsDialog(true);
      }

      // Update document without closing dialogs
      onDocumentUpdate();
      fetchCommentCount(); // Refresh comment count
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const addSystemComment = async (content: string) => {
    try {
      await fetch(`/api/documents/${document.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          isSystem: true,
        }),
      });
      fetchCommentCount(); // Refresh comment count after adding system comment
    } catch (error) {
      console.error("Error adding system comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] font-sans">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Document Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              View document information and manage the file
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Name
                </h4>
                <p className="mt-1">{document.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Type
                </h4>
                <p className="mt-1">{document.type.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Department
                </h4>
                <p className="mt-1">{document.department?.name ?? "Pending"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Description
              </h4>
              <p className="mt-1">{document.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Status
                </h4>
                <p className="mt-1">{document.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Submitted
                </h4>
                <p className="mt-1">{formatDate(document.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div className="space-x-2">
                <Button
                  onClick={() => setShowDeleteAlert(true)}
                  disabled={deleting}
                  variant="destructive"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updating}
                  variant="outline"
                >
                  {updating ? "Updating..." : "Replace File"}
                </Button>
                <Button
                  onClick={() => setShowCommentsDialog(true)}
                  variant="outline"
                  className="relative"
                >
                  Comments & History
                  {commentCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {commentCount}
                    </span>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleUpdate}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </div>
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {downloading ? "Downloading..." : "Download"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DocumentCommentsDialog
        documentId={document.id}
        open={showCommentsDialog}
        onOpenChange={setShowCommentsDialog}
        onCommentAdded={() => {
          // Just refresh the document data and comment count without closing any dialogs
          onDocumentUpdate();
          fetchCommentCount();
        }}
      />
    </>
  );
}

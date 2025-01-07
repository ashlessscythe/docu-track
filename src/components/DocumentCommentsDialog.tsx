"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
}

interface DocumentCommentsDialogProps {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdded?: () => void;
}

export function DocumentCommentsDialog({
  documentId,
  open,
  onOpenChange,
  onCommentAdded,
}: DocumentCommentsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${documentId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/documents/${documentId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      setNewComment("");
      // Refresh comments list without closing dialog
      await fetchComments();
      // Notify parent component about the new comment without closing dialogs
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Document Comments & History
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and add comments or review document history
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Comments List */}
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No comments yet
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {comment.user.role}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? "Adding..." : "Add Comment"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

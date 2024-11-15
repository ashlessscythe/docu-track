"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentSubmissionForm } from "./DocumentSubmissionForm";

interface SubmitDocumentDialogProps {
  onSuccess?: () => void;
}

export function SubmitDocumentDialog({ onSuccess }: SubmitDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-black/90">
          Submit New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Submit Document
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill out the form below to submit a new document for approval.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <DocumentSubmissionForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

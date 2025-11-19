"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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

type EmailTemplate =
  | "welcome"
  | "password-reset"
  | "account-approval"
  | "admin-new-user"
  | "document-action";

interface EmailFormData {
  template: EmailTemplate;
  // Common fields
  recipientEmail: string;
  recipientName: string;
  // Welcome & Account Approval
  role?: string;
  // Password Reset
  resetLink?: string;
  // Admin New User
  userName?: string;
  userEmail?: string;
  dashboardUrl?: string;
  // Document Action
  documentName?: string;
  documentType?: string;
  departmentName?: string;
  actionType?: "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
  actionByName?: string;
  comments?: string;
}

export default function TestEmailsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPlaceholderDialog, setShowPlaceholderDialog] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [placeholderFields, setPlaceholderFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<EmailFormData>({
    template: "welcome",
    recipientEmail: "",
    recipientName: "",
  });

  const handleTemplateChange = (template: EmailTemplate) => {
    setFormData({
      template,
      recipientEmail: formData.recipientEmail,
      recipientName: formData.recipientName,
    });
  };

  const checkForPlaceholders = (): string[] => {
    const missing: string[] = [];

    switch (formData.template) {
      case "welcome":
        if (!formData.recipientName) missing.push("Recipient Name");
        break;
      case "password-reset":
        if (!formData.recipientName) missing.push("Recipient Name");
        break;
      case "account-approval":
        if (!formData.recipientName) missing.push("Recipient Name");
        if (!formData.role) missing.push("User Role");
        break;
      case "admin-new-user":
        if (!formData.userName) missing.push("New User Name");
        if (!formData.userEmail) missing.push("New User Email");
        break;
      case "document-action":
        if (!formData.recipientName) missing.push("Recipient Name");
        if (!formData.documentName) missing.push("Document Name");
        if (!formData.documentType) missing.push("Document Type");
        if (!formData.actionType) missing.push("Action Type");
        if (!formData.actionByName) missing.push("Action By (Name)");
        break;
    }

    return missing;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientEmail) {
      toast({
        title: "Recipient email required",
        description: "Please provide a recipient email address.",
        variant: "destructive",
      });
      return;
    }

    const missingFields = checkForPlaceholders();

    if (missingFields.length > 0) {
      setPlaceholderFields(missingFields);
      setShowPlaceholderDialog(true);
      setPendingSubmit(true);
      return;
    }

    await sendEmail();
  };

  const sendEmail = async () => {
    setLoading(true);
    setShowPlaceholderDialog(false);
    setPendingSubmit(false);

    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast({
        title: "Email sent successfully!",
        description: "Check your inbox or Resend dashboard to view the email.",
      });

      // Reset form
      setFormData({
        template: formData.template,
        recipientEmail: "",
        recipientName: "",
      });
    } catch (error) {
      toast({
        title: "Error sending email",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (formData.template) {
      case "welcome":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>
          </>
        );

      case "password-reset":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resetLink">
                Reset Link (optional - will be auto-generated if empty)
              </Label>
              <Input
                id="resetLink"
                value={formData.resetLink || ""}
                onChange={(e) =>
                  setFormData({ ...formData, resetLink: e.target.value })
                }
                placeholder="https://example.com/reset-password?token=..."
              />
            </div>
          </>
        );

      case "account-approval":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">User Role (optional)</Label>
              <Select
                value={formData.role || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground rounded-md shadow-md border-border border">
                  <SelectItem value="SUBMITTER">Submitter</SelectItem>
                  <SelectItem value="APPROVER">Approver</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "admin-new-user":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="userName">New User Name (optional)</Label>
              <Input
                id="userName"
                value={formData.userName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">New User Email (optional)</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                placeholder="newuser@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Admin Email (Recipient)</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboardUrl">Dashboard URL (optional)</Label>
              <Input
                id="dashboardUrl"
                value={formData.dashboardUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dashboardUrl: e.target.value })
                }
                placeholder="https://example.com/admin/users"
              />
            </div>
          </>
        );

      case "document-action":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name (optional)</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name (optional)</Label>
              <Input
                id="documentName"
                value={formData.documentName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, documentName: e.target.value })
                }
                placeholder="Q4 Report 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type (optional)</Label>
              <Input
                id="documentType"
                value={formData.documentType || ""}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
                placeholder="Financial Report"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department Name (optional)</Label>
              <Input
                id="departmentName"
                value={formData.departmentName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, departmentName: e.target.value })
                }
                placeholder="Finance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type (optional)</Label>
              <Select
                value={formData.actionType || ""}
                onValueChange={(
                  value: "APPROVED" | "REJECTED" | "NEEDS_REVIEW"
                ) => setFormData({ ...formData, actionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground rounded-md shadow-md border-border border">
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionByName">Action By (Name) (optional)</Label>
              <Input
                id="actionByName"
                value={formData.actionByName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, actionByName: e.target.value })
                }
                placeholder="Admin User"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">
                Comments (optional, one per line)
              </Label>
              <Textarea
                id="comments"
                value={formData.comments || ""}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Great work!&#10;Please add more details."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboardUrl">Dashboard URL (optional)</Label>
              <Input
                id="dashboardUrl"
                value={formData.dashboardUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dashboardUrl: e.target.value })
                }
                placeholder="https://example.com/dashboard/documents/123"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Email Templates</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Send test emails to preview how your email templates look. All
            emails will be sent to the recipient email address you specify.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template">Email Template</Label>
              <Select
                value={formData.template}
                onValueChange={handleTemplateChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground rounded-md shadow-md border-border border">
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="password-reset">
                    Password Reset Email
                  </SelectItem>
                  <SelectItem value="account-approval">
                    Account Approval Email
                  </SelectItem>
                  <SelectItem value="admin-new-user">
                    Admin New User Notification
                  </SelectItem>
                  <SelectItem value="document-action">
                    Document Action Email
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">{renderFormFields()}</div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    template: formData.template,
                    recipientEmail: "",
                    recipientName: "",
                  });
                }}
              >
                Clear
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Test Email"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={showPlaceholderDialog}
        onOpenChange={setShowPlaceholderDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Using Placeholder Values</AlertDialogTitle>
            <AlertDialogDescription>
              The following fields are missing and will use placeholder values:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <ul className="list-disc list-inside mt-2 space-y-1">
              {placeholderFields.map((field) => (
                <li key={field} className="text-sm">
                  {field}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Do you want to proceed with placeholder values?
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSubmit(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={sendEmail}>
              Yes, Use Placeholders
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

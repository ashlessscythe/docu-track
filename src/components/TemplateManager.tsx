"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Template, Department, DocumentType } from "@/types";

type TemplateWithoutContent = Omit<Template, "content">;

export default function TemplateManager() {
  const [templates, setTemplates] = useState<TemplateWithoutContent[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/departments");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchDocumentTypes = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/document-types");
      if (!response.ok) throw new Error("Failed to fetch document types");
      const data = await response.json();
      setDocumentTypes(data);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch document types",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
    fetchDepartments();
    fetchDocumentTypes();
  }, [fetchTemplates, fetchDepartments, fetchDocumentTypes]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Handle the special "global" value for departmentId
    const departmentId = formData.get("departmentId");
    if (departmentId === "global") {
      formData.delete("departmentId");
    }

    try {
      const response = await fetch("/api/admin/templates", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create template");

      toast({
        title: "Success",
        description: "Template created successfully",
      });

      setIsAddDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      toast({
        title: "Success",
        description: "Template deleted successfully",
      });

      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Template Management
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Template</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Template</DialogTitle>
                <DialogDescription>
                  Upload a new document template file.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select name="departmentId">
                    <SelectTrigger className="text-foreground bg-background border border-border shadow-sm rounded-md">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="text-foreground bg-background border border-border shadow-sm rounded-md">
                      <SelectItem value="global">
                        Global (No Department)
                      </SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select name="typeId" required>
                    <SelectTrigger className="text-foreground bg-background border border-border shadow-sm rounded-md">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent className="text-foreground bg-background border border-border shadow-sm rounded-md">
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Template File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    className="cursor-pointer"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Upload Template</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {template.type.name}
                </div>
                <div>
                  <span className="font-medium">Department:</span>{" "}
                  {template.department?.name || "Global"}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(`/api/templates/${template.id}/download`)
                    }
                  >
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentType } from "@/types";

export default function DocumentTypesManagement() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
  const [isEditTypeOpen, setIsEditTypeOpen] = useState(false);
  const [newType, setNewType] = useState<Partial<DocumentType>>({
    name: "",
    description: "",
    type: "default",
  });
  const [editingType, setEditingType] = useState<DocumentType | null>(null);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch("/api/admin/document-types");
      const data = await response.json();
      setDocumentTypes(data);
    } catch (error) {
      console.error("Failed to fetch document types:", error);
    }
  };

  const handleAddDocumentType = async () => {
    try {
      const response = await fetch("/api/admin/document-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newType),
      });

      if (response.ok) {
        setIsAddTypeOpen(false);
        fetchDocumentTypes();
        setNewType({ name: "", description: "", type: "default" });
      }
    } catch (error) {
      console.error("Failed to add document type:", error);
    }
  };

  const handleEditDocumentType = async () => {
    if (!editingType) return;

    try {
      const response = await fetch(
        `/api/admin/document-types/${editingType.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingType.name,
            description: editingType.description,
            type: editingType.type,
          }),
        }
      );

      if (response.ok) {
        setIsEditTypeOpen(false);
        fetchDocumentTypes();
        setEditingType(null);
      }
    } catch (error) {
      console.error("Failed to update document type:", error);
    }
  };

  const handleDeleteDocumentType = async (typeId: string) => {
    if (!confirm("Are you sure you want to delete this document type?")) return;

    try {
      const response = await fetch(`/api/admin/document-types/${typeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        alert(error);
        return;
      }

      fetchDocumentTypes();
    } catch (error) {
      console.error("Failed to delete document type:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Types Management</h1>
        <Dialog open={isAddTypeOpen} onOpenChange={setIsAddTypeOpen}>
          <DialogTrigger asChild>
            <Button>Add Document Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document Type</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newType.name}
                  onChange={(e) =>
                    setNewType({ ...newType, name: e.target.value })
                  }
                  placeholder="Enter document type name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newType.description}
                  onChange={(e) =>
                    setNewType({ ...newType, description: e.target.value })
                  }
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newType.type}
                  onValueChange={(value) =>
                    setNewType({ ...newType, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddDocumentType}>Add Document Type</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.description || "N/A"}</TableCell>
              <TableCell>{type.type || "default"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingType(type);
                    setIsEditTypeOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteDocumentType(type.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Document Type Dialog */}
      <Dialog open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingType?.name || ""}
                onChange={(e) =>
                  setEditingType((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingType?.description || ""}
                onChange={(e) =>
                  setEditingType((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editingType?.type || "default"}
                onValueChange={(value) =>
                  setEditingType((prev) =>
                    prev ? { ...prev, type: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditDocumentType}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

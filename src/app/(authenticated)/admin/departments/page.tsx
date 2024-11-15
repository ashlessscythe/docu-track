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
import type { Department } from "@/types";

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/admin/departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleAddDepartment = async () => {
    try {
      const response = await fetch("/api/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDepartment),
      });

      if (response.ok) {
        setIsAddDepartmentOpen(false);
        fetchDepartments();
        setNewDepartment({ name: "", description: "" });
      }
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  const handleEditDepartment = async () => {
    if (!editingDepartment) return;

    try {
      const response = await fetch(
        `/api/admin/departments/${editingDepartment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingDepartment.name,
            description: editingDepartment.description,
          }),
        }
      );

      if (response.ok) {
        setIsEditDepartmentOpen(false);
        fetchDepartments();
        setEditingDepartment(null);
      }
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const response = await fetch(`/api/admin/departments/${departmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        alert(error);
        return;
      }

      fetchDepartments();
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Department Management</h1>
        <Dialog
          open={isAddDepartmentOpen}
          onOpenChange={setIsAddDepartmentOpen}
        >
          <DialogTrigger asChild>
            <Button>Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description || "N/A"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingDepartment(department);
                    setIsEditDepartmentOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteDepartment(department.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Department Dialog */}
      <Dialog
        open={isEditDepartmentOpen}
        onOpenChange={setIsEditDepartmentOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingDepartment?.name || ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingDepartment?.description || ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditDepartment}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

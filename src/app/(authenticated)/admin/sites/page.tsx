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
import type { Site } from "@/types";

export default function SitesManagement() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isEditSiteOpen, setIsEditSiteOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: "",
    description: "",
  });
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/admin/sites");
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    }
  };

  const handleAddSite = async () => {
    try {
      const response = await fetch("/api/admin/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSite),
      });

      if (response.ok) {
        setIsAddSiteOpen(false);
        fetchSites();
        setNewSite({ name: "", description: "" });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add site");
      }
    } catch (error) {
      console.error("Failed to add site:", error);
    }
  };

  const handleEditSite = async () => {
    if (!editingSite) return;

    try {
      const response = await fetch(`/api/admin/sites/${editingSite.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingSite.name,
          description: editingSite.description,
        }),
      });

      if (response.ok) {
        setIsEditSiteOpen(false);
        fetchSites();
        setEditingSite(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update site");
      }
    } catch (error) {
      console.error("Failed to update site:", error);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      const response = await fetch(`/api/admin/sites/${siteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete site");
        return;
      }

      fetchSites();
    } catch (error) {
      console.error("Failed to delete site:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Site Management</h1>
        <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
          <DialogTrigger asChild>
            <Button>Add Site</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSite.name}
                  onChange={(e) =>
                    setNewSite({ ...newSite, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSite.description}
                  onChange={(e) =>
                    setNewSite({
                      ...newSite,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddSite}>Add Site</Button>
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
          {sites.map((site) => (
            <TableRow key={site.id}>
              <TableCell>{site.name}</TableCell>
              <TableCell>{site.description || "N/A"}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSite(site);
                    setIsEditSiteOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteSite(site.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Site Dialog */}
      <Dialog open={isEditSiteOpen} onOpenChange={setIsEditSiteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingSite?.name || ""}
                onChange={(e) =>
                  setEditingSite((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingSite?.description || ""}
                onChange={(e) =>
                  setEditingSite((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditSite}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

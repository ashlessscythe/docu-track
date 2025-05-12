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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Site, User } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function SitesManagement() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isEditSiteOpen, setIsEditSiteOpen] = useState(false);
  const [isViewUsersOpen, setIsViewUsersOpen] = useState(false);
  const [isMoveUserOpen, setIsMoveUserOpen] = useState(false);
  const [siteUsers, setSiteUsers] = useState<User[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMovingUser, setIsMovingUser] = useState(false);
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

  const fetchSiteUsers = async (siteId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/sites/${siteId}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch site users");
      }
      const data = await response.json();
      setSiteUsers(data);
    } catch (error) {
      console.error("Failed to fetch site users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUsers = (site: Site) => {
    setCurrentSite(site);
    fetchSiteUsers(site.id);
    setIsViewUsersOpen(true);
  };

  const handleMoveUser = (user: User) => {
    setSelectedUser(user);
    setSelectedSiteId("");
    setIsMoveUserOpen(true);
  };

  const handleUserSiteChange = async () => {
    if (!selectedUser || !selectedSiteId) return;

    setIsMovingUser(true);
    try {
      const response = await fetch(
        `/api/admin/users/${selectedUser.id}/update-site`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: selectedSiteId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to move user");
        return;
      }

      // Close the move dialog
      setIsMoveUserOpen(false);

      // Refresh the users list if we're still viewing the same site
      if (currentSite) {
        fetchSiteUsers(currentSite.id);
      }

      // Reset selected user and site
      setSelectedUser(null);
      setSelectedSiteId("");
    } catch (error) {
      console.error("Failed to move user:", error);
      alert("An error occurred while moving the user");
    } finally {
      setIsMovingUser(false);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500";
      case "APPROVER":
        return "bg-blue-500";
      case "SUBMITTER":
        return "bg-green-500";
      case "REPORTER":
        return "bg-purple-500";
      case "PENDING":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                  <Button
                    variant="secondary"
                    onClick={() => handleViewUsers(site)}
                  >
                    View Users
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sites.map((site) => (
          <Card key={site.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{site.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Description
                </div>
                <div className="text-sm">{site.description || "N/A"}</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingSite(site);
                  setIsEditSiteOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDeleteSite(site.id)}
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                className="flex-1 mt-2 w-full"
                onClick={() => handleViewUsers(site)}
              >
                View Users
              </Button>
            </CardFooter>
          </Card>
        ))}
        {sites.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
            No sites available
          </div>
        )}
      </div>

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

      {/* View Site Users Dialog */}
      <Dialog open={isViewUsersOpen} onOpenChange={setIsViewUsersOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Users for {currentSite?.name || "Selected Site"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoading ? (
              <div className="text-center p-8">Loading users...</div>
            ) : (
              <>
                {siteUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    {/* Desktop Users Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {siteUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${getRoleBadgeColor(user.role)}`}
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.department?.name || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMoveUser(user)}
                                >
                                  Move to Site
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Users Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {siteUsers.map((user) => (
                        <Card key={user.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {user.name}
                            </CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 py-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                Role
                              </div>
                              <Badge
                                className={`${getRoleBadgeColor(user.role)}`}
                              >
                                {user.role}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                Department
                              </div>
                              <div className="text-sm font-medium">
                                {user.department?.name || "N/A"}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => handleMoveUser(user)}
                            >
                              Move to Site
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-muted/10 text-muted-foreground">
                    No users found for this site
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsViewUsersOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move User Dialog */}
      <Dialog open={isMoveUserOpen} onOpenChange={setIsMoveUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move User to Another Site</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">User</p>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm">{selectedUser.email}</p>
              </div>
            )}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-select">Select Destination Site</Label>
                <Select
                  value={selectedSiteId}
                  onValueChange={setSelectedSiteId}
                >
                  <SelectTrigger id="site-select">
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent className="border border-border rounded-md shadow-sm bg-background text-foreground">
                    {sites
                      .filter((site) => site.id !== currentSite?.id) // Filter out current site
                      .map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-amber-600">
                Note: Moving a user to another site will remove their department
                association.
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsMoveUserOpen(false)}
              disabled={isMovingUser}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUserSiteChange}
              disabled={!selectedSiteId || isMovingUser}
            >
              {isMovingUser ? "Moving..." : "Move User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

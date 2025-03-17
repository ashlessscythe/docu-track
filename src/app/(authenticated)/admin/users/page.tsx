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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole, Department, Site } from "@/types";
import EditUserModal from "@/components/EditUserModal";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    departmentId: "",
    siteId: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchSites();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/admin/departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/admin/sites");
      const data = await response.json();
      setSites(data);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setIsAddUserOpen(false);
        fetchUsers();
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "",
          departmentId: "",
          siteId: "",
        });
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleEditUser = async (userData: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    siteId?: string;
    password?: string;
  }) => {
    try {
      await fetch(`/api/admin/users/${userData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      setIsEditUserOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getRoleDisplay = (role: UserRole): string => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const getDepartmentDisplay = (
    department: Department | undefined | null
  ): string => {
    if (!department) return "N/A";
    return department.name;
  };

  const getSiteDisplay = (site: Site | undefined | null): string => {
    if (!site) return "N/A";
    return site.name;
  };

  // Get all roles from the UserRole enum
  const roleOptions = Object.values(UserRole);

  // Filter departments by selected site if a site is selected
  const filteredDepartments = newUser.siteId
    ? departments.filter(
        (dept) => dept.siteId === newUser.siteId || !dept.siteId
      )
    : departments;

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: string) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                    <SelectValue>
                      {newUser.role
                        ? getRoleDisplay(newUser.role as UserRole)
                        : "Select role"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplay(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {sites.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="site">Site</Label>
                  <Select
                    value={newUser.siteId}
                    onValueChange={(value: string) =>
                      setNewUser({ ...newUser, siteId: value })
                    }
                  >
                    <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                      <SelectValue>
                        {newUser.siteId
                          ? sites.find((s) => s.id === newUser.siteId)?.name
                          : "Select site"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newUser.departmentId}
                  onValueChange={(value: string) =>
                    setNewUser({ ...newUser, departmentId: value })
                  }
                >
                  <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                    <SelectValue>
                      {newUser.departmentId
                        ? departments.find((d) => d.id === newUser.departmentId)
                            ?.name
                        : "Select department"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                    {filteredDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddUser}>Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit User Modal Component */}
      <EditUserModal
        isOpen={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        user={selectedUser}
        departments={departments}
        sites={sites}
        onSave={handleEditUser}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: string) =>
                    handleUpdateUserRole(user.id, value as UserRole)
                  }
                >
                  <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                    <SelectValue>{getRoleDisplay(user.role)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplay(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{getSiteDisplay(user?.site)}</TableCell>
              <TableCell>{getDepartmentDisplay(user.department)}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" onClick={() => openEditModal(user)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

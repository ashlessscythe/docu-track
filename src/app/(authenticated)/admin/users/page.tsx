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
import { User, UserRole, Department } from "@/types";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    departmentId: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
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

  const handleEditUser = async () => {
    try {
      const updateData: any = {};
      if (selectedDepartmentId) {
        updateData.departmentId = selectedDepartmentId;
      }
      if (newPassword) {
        updateData.password = newPassword;
      }

      await fetch(`/api/admin/users/${selectedUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      setIsEditUserOpen(false);
      setNewPassword("");
      setSelectedUserId("");
      setSelectedDepartmentId("");
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

  // Get all roles from the UserRole enum
  const roleOptions = Object.values(UserRole);

  const openEditModal = (user: User) => {
    setSelectedUserId(user.id);
    setSelectedDepartmentId(user.department?.id || "");
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
                    {departments.map((dept) => (
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

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select
                value={selectedDepartmentId}
                onValueChange={setSelectedDepartmentId}
              >
                <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                  <SelectValue>
                    {selectedDepartmentId
                      ? departments.find((d) => d.id === selectedDepartmentId)
                          ?.name
                      : "Select department"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password (optional)</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditUser}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

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

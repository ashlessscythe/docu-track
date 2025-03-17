import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { User, Department, Site } from "@/types";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  departments: Department[];
  sites?: Site[];
  onSave: (userData: {
    id: string;
    name: string;
    email: string;
    departmentId: string;
    siteId?: string;
    password?: string;
  }) => void;
}

export default function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  departments,
  sites = [],
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [password, setPassword] = useState("");

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setDepartmentId(user.departmentId || user.department?.id || "");
      setSiteId(user.siteId || user.site?.id || "");
      setPassword("");
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    const userData = {
      id: user.id,
      name,
      email,
      departmentId,
      ...(siteId ? { siteId } : {}),
      ...(password ? { password } : {}),
    };

    onSave(userData);
  };

  // Filter departments by selected site if a site is selected
  const filteredDepartments = siteId
    ? departments.filter((dept) => dept.siteId === siteId || !dept.siteId)
    : departments;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {sites.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="edit-site">Site</Label>
              <Select value={siteId} onValueChange={setSiteId}>
                <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                  <SelectValue>
                    {siteId
                      ? sites.find((s) => s.id === siteId)?.name
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
            <Label htmlFor="edit-department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                <SelectValue>
                  {departmentId
                    ? departments.find((d) => d.id === departmentId)?.name
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
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password (optional)</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

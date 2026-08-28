import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Document Management</h2>
          <p className="text-muted-foreground mb-4">
            View and manage all submitted documents and their status
          </p>
          <Link href="/admin/documents">
            <Button className="w-full">Manage Documents</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-muted-foreground mb-4">
            Manage user accounts, roles, and permissions
          </p>
          <Link href="/admin/users">
            <Button className="w-full">Manage Users</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Department Management</h2>
          <p className="text-muted-foreground mb-4">
            Add, edit, or remove departments
          </p>
          <Link href="/admin/departments">
            <Button className="w-full">Manage Departments</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Document Types</h2>
          <p className="text-muted-foreground mb-4">
            Configure document types and their properties
          </p>
          <Link href="/admin/document-types">
            <Button className="w-full">Manage Document Types</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Template Management</h2>
          <p className="text-muted-foreground mb-4">
            Upload and manage document templates
          </p>
          <Link href="/admin/templates">
            <Button className="w-full">Manage Templates</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Site Management</h2>
          <p className="text-muted-foreground mb-4">
            Manage sites for multi-tenant functionality
          </p>
          <Link href="/admin/sites">
            <Button className="w-full">Manage Sites</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Reports</h2>
          <p className="text-muted-foreground mb-4">
            View system statistics and generate reports
          </p>
          <Link href="/admin/reports">
            <Button className="w-full">View Reports</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Database Operations</h2>
          <p className="text-muted-foreground mb-4">
            Perform database backups and maintenance
          </p>
          <Link href="/admin/database">
            <Button className="w-full">Database Tools</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Feedback Management</h2>
          <p className="text-muted-foreground mb-4">
            View and manage user feedback submissions
          </p>
          <Link href="/admin/feedback">
            <Button className="w-full">Manage Feedback</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Email Templates</h2>
          <p className="text-muted-foreground mb-4">
            Send test emails to preview email templates
          </p>
          <Link href="/admin/test-emails">
            <Button className="w-full">Test Emails</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

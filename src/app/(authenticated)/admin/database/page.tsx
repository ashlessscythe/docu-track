"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DatabaseManagement() {
  const [backupStatus, setBackupStatus] = useState<string>("");
  const [restoreStatus, setRestoreStatus] = useState<string>("");

  const handleBackup = async () => {
    try {
      setBackupStatus("Initiating backup...");
      const response = await fetch("/api/admin/database/backup", {
        method: "POST",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setBackupStatus("Backup completed successfully");
      } else {
        setBackupStatus("Failed to create backup");
      }
    } catch (error) {
      console.error("Backup failed:", error);
      setBackupStatus("Failed to create backup");
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setRestoreStatus("Initiating restore...");
      const formData = new FormData();
      formData.append("backup", file);

      const response = await fetch("/api/admin/database/restore", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setRestoreStatus("Database restored successfully");
      } else {
        const error = await response.text();
        setRestoreStatus(`Failed to restore database: ${error}`);
      }
    } catch (error) {
      console.error("Restore failed:", error);
      setRestoreStatus("Failed to restore database");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backup Database</CardTitle>
            <CardDescription>
              Create a backup of the current database state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackup} className="w-full">
              Create Backup
            </Button>
            {backupStatus && (
              <Alert className="mt-4">
                <AlertDescription>{backupStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore Database</CardTitle>
            <CardDescription>
              Restore the database from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
                id="restore-file"
              />
              <Button
                onClick={() => document.getElementById("restore-file")?.click()}
                className="w-full"
              >
                Select Backup File
              </Button>
              {restoreStatus && (
                <Alert>
                  <AlertDescription>{restoreStatus}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types";

type TemplateWithoutContent = Omit<Template, "content">;

export default function TemplateList() {
  const [templates, setTemplates] = useState<TemplateWithoutContent[]>([]);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/templates");
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

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Document Templates
        </h2>
        <p className="text-muted-foreground mt-2">
          Download templates for document submission
        </p>
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
                <Button
                  onClick={() =>
                    window.open(`/api/templates/${template.id}/download`)
                  }
                >
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

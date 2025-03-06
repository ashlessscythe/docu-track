"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Department {
  id: string;
  name: string;
}

interface DocumentType {
  id: string;
  name: string;
}

const formSchema = z.object({
  typeId: z.string().min(1, "Document type is required"),
  description: z.string().min(1, "Description is required"),
  departmentId: z.string().optional(),
});

interface DocumentSubmissionFormProps {
  onSuccess?: () => void;
}

export function DocumentSubmissionForm({
  onSuccess,
}: DocumentSubmissionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeId: "",
      description: "",
      departmentId: undefined,
    },
  });

  // Fetch departments and document types
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch("/api/departments");
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData);
        }

        // Fetch document types
        const typeResponse = await fetch("/api/document-types");
        if (typeResponse.ok) {
          const typeData = await typeResponse.json();
          setDocumentTypes(typeData);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      form.setError("root", {
        message: "Please select a file to upload",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("typeId", values.typeId);
      formData.append("description", values.description);
      if (values.departmentId && session?.user.role !== "PENDING") {
        formData.append("departmentId", values.departmentId);
      }
      formData.append("file", file);

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit document");
      }

      // Reset form and refresh documents list
      form.reset();
      setFile(null);
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting document:", error);
      form.setError("root", {
        message: "Failed to submit document. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 font-sans"
      >
        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                  {documentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter document description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {session?.user.role !== "PENDING" && (
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background text-foreground border border-border rounded-md shadow-sm">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-lg">
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormItem>
          <FormLabel className="font-medium">Document File</FormLabel>
          <FormControl>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              className="cursor-pointer"
            />
          </FormControl>
          {!file && form.formState.isSubmitted && (
            <FormMessage>Please select a file</FormMessage>
          )}
          {file && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file: {file.name}
            </p>
          )}
        </FormItem>

        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

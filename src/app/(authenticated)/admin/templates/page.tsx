import { Metadata } from "next";
import TemplateManager from "@/components/TemplateManager";

export const metadata: Metadata = {
  title: "Template Management",
  description: "Manage document templates",
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-10">
      <TemplateManager />
    </div>
  );
}

export const dynamic = "force-dynamic";

import { Metadata } from "next";
import TemplateList from "@/components/TemplateList";

export const metadata: Metadata = {
  title: "Templates",
  description: "Download document templates",
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-10">
      <TemplateList />
    </div>
  );
}

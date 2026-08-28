import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DocumentTypesClient } from "./document-types-client";

export default async function DocumentTypesPage() {
  const session = await getServerSession(authOptions);
  const siteId = session?.user?.siteId;

  const documentTypes = await prisma.documentType.findMany({
    where: siteId ? { siteId } : {},
    orderBy: { name: "asc" },
  });

  const formattedTypes = documentTypes.map((type) => {
    try {
      const descriptionData = JSON.parse(
        type.description || '{"text": "", "type": "default"}'
      );
      return {
        id: type.id,
        name: type.name,
        description: descriptionData.text as string,
        type: descriptionData.type as string,
      };
    } catch {
      return {
        id: type.id,
        name: type.name,
        description: type.description || "",
        type: "default",
      };
    }
  });

  return <DocumentTypesClient initialDocumentTypes={formattedTypes} />;
}

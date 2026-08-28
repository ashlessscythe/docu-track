import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DepartmentsClient } from "./departments-client";

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions);
  const siteId = session?.user?.siteId;

  const [departments, sites] = await Promise.all([
    prisma.department.findMany({
      where: siteId ? { siteId } : {},
      include: { site: true },
      orderBy: { name: "asc" },
    }),
    prisma.site.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <DepartmentsClient
      initialDepartments={departments.map((d) => ({
        ...d,
        description: d.description ?? undefined,
        site: d.site
          ? { ...d.site, description: d.site.description ?? undefined }
          : undefined,
      }))}
      initialSites={sites.map((s) => ({
        ...s,
        description: s.description ?? undefined,
      }))}
    />
  );
}

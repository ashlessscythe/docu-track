import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const documentCount = await prisma.document.count();
  console.log(`Total documents: ${documentCount}`);

  const tagsCount = await prisma.tag.count();
  console.log(`Total tags: ${tagsCount}`);

  const approvalsCount = await prisma.approval.count();
  console.log(`Total approvals: ${approvalsCount}`);

  const notificationsCount = await prisma.notification.count();
  console.log(`Total notifications: ${notificationsCount}`);

  const sampleDocument = await prisma.document.findFirst({
    include: { documentTags: { include: { tag: true } } },
  });
  console.log('Sample document title:', sampleDocument?.title);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
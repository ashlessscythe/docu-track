import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create Tags
    const tags = await Promise.all(
      Array.from({ length: 5 }, () =>
        prisma.tag.create({ data: { name: faker.word.noun() } })
      )
    );

    // Create Documents with blob content
    const documents = await Promise.all(
      Array.from({ length: 10 }, async () => {
        const doc = await prisma.document.create({
          data: {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(),
            blobContent: Buffer.from(faker.lorem.paragraphs()),
            fileUrl: faker.internet.url(),
            createdBy: faker.internet.email(),
          },
        });

        // Create DocumentTags separately to avoid duplicates
        const uniqueTags = faker.helpers.arrayElements(tags, { min: 1, max: 3 });
        for (const tag of uniqueTags) {
          await prisma.documentTag.create({
            data: {
              documentId: doc.id,
              tagId: tag.id,
            },
          }).catch(error => {
            if (error.code === 'P2002') {
              console.log(`Skipping duplicate DocumentTag for document ${doc.id} and tag ${tag.id}`);
            } else {
              throw error;
            }
          });
        }

        return doc;
      })
    );

    // Create Approvals
    await Promise.all(
      Array.from({ length: 20 }, () =>
        prisma.approval.create({
          data: {
            documentId: faker.helpers.arrayElement(documents).id,
            approverId: faker.internet.email(),
            status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
            comment: faker.lorem.sentence(),
          },
        })
      )
    );

    // Create Notifications
    await Promise.all(
      Array.from({ length: 15 }, () =>
        prisma.notification.create({
          data: {
            type: faker.helpers.arrayElement(['approval_request', 'document_update', 'approval_status']),
            status: faker.helpers.arrayElement(['read', 'unread']),
            message: faker.lorem.sentence(),
            userId: faker.internet.email(),
          },
        })
      )
    );

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

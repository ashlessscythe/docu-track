import { PrismaClient, UserRole, DocumentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedArgs {
  "use-faker": boolean;
  count: number;
  clear: boolean;
}

// Parse command line arguments using yargs
const parseArgs = async (): Promise<SeedArgs> => {
  return yargs(hideBin(process.argv))
    .options({
      "use-faker": {
        alias: "f",
        type: "boolean",
        description: "Use faker to generate realistic data",
        default: false,
      },
      count: {
        alias: "n",
        type: "number",
        description: "Number of records to generate",
        default: 10,
      },
      clear: {
        alias: "c",
        type: "boolean",
        description: "Clear existing data before seeding",
        default: false,
      },
    })
    .help()
    .parse() as unknown as SeedArgs;
};

// Generate a random role
const getRandomRole = (): UserRole => {
  const roles = [UserRole.SUBMITTER, UserRole.APPROVER, UserRole.ADMIN];
  return roles[Math.floor(Math.random() * roles.length)];
};

// Hash password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Generate fake user data
const createFakeUser = async () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: getRandomRole(),
  password: await hashPassword(faker.internet.password()),
  department: faker.commerce.department(),
});

// Generate fake document data
const createFakeDocument = (userId: string) => {
  // Generate random content as Bytes
  const content = Buffer.from(faker.lorem.paragraphs());

  const fileTypes = [
    { ext: "pdf", mime: "application/pdf" },
    { ext: "doc", mime: "application/msword" },
    {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    { ext: "txt", mime: "text/plain" },
  ];

  const fileType = faker.helpers.arrayElement(fileTypes);

  return {
    name: `${faker.system.fileName()}.${fileType.ext}`,
    type: fileType.ext.toUpperCase(),
    description: faker.lorem.paragraph(),
    department: faker.commerce.department(),
    status: faker.helpers.arrayElement([
      DocumentStatus.PENDING,
      DocumentStatus.APPROVED,
      DocumentStatus.REJECTED,
      DocumentStatus.NEEDS_REVIEW,
    ]),
    content,
    mimeType: fileType.mime,
    submitterId: userId,
  };
};

// Default seed data when not using faker
const defaultUsers = [
  {
    email: "bob@bob.bob",
    name: "Bob",
    role: UserRole.ADMIN,
    password: "bob", // Will be hashed before saving
    department: "IT",
  },
  {
    email: "approver@example.com",
    name: "Approver User",
    role: UserRole.APPROVER,
    password: "approver123",
    department: "HR",
  },
  {
    email: "submitter@example.com",
    name: "Submitter User",
    role: UserRole.SUBMITTER,
    password: "submitter123",
    department: "Engineering",
  },
];

const defaultDocuments = [
  {
    name: "Sample Document 1.pdf",
    type: "PDF",
    description: "A sample document for testing",
    department: "IT",
    status: DocumentStatus.PENDING,
    content: Buffer.from("Sample document content 1"),
    mimeType: "application/pdf",
  },
  {
    name: "Sample Document 2.docx",
    type: "DOCX",
    description: "Another sample document",
    department: "HR",
    status: DocumentStatus.APPROVED,
    content: Buffer.from("Sample document content 2"),
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
];

async function main() {
  const args = await parseArgs();

  console.log("Seeding database with options:", {
    useFaker: args["use-faker"],
    count: args.count,
    clear: args.clear,
  });

  if (args.clear) {
    console.log("Clearing existing data...");
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();
  }

  if (args["use-faker"]) {
    console.log(`Generating ${args.count} fake records...`);

    // Create users
    const users = await Promise.all(
      Array.from({ length: args.count }, async () => {
        const userData = await createFakeUser();
        return await prisma.user.create({ data: userData });
      })
    );

    // Create documents and randomly assign approvers for some documents
    const approvers = users.filter((user) => user.role === UserRole.APPROVER);

    await Promise.all(
      users
        .filter((user) => user.role === UserRole.SUBMITTER)
        .flatMap((user) =>
          Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            async () => {
              const documentData = createFakeDocument(user.id);
              // Randomly assign an approver to some documents
              if (approvers.length > 0 && Math.random() > 0.5) {
                const approver = faker.helpers.arrayElement(approvers);
                return await prisma.document.create({
                  data: {
                    ...documentData,
                    approverId: approver.id,
                  },
                });
              }
              return await prisma.document.create({ data: documentData });
            }
          )
        )
    );
  } else {
    console.log("Using default seed data...");

    // Create default users with hashed passwords
    const users = await Promise.all(
      defaultUsers.map(async (userData) => {
        const hashedPassword = await hashPassword(userData.password);
        return await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        });
      })
    );

    // Create default documents
    await Promise.all(
      defaultDocuments.map(async (doc) => {
        return await prisma.document.create({
          data: {
            ...doc,
            submitterId: users[2].id, // Assign to submitter user
            approverId: users[1].id, // Assign to approver user
          },
        });
      })
    );
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
  const roles = [
    UserRole.SUBMITTER,
    UserRole.APPROVER,
    UserRole.ADMIN,
    UserRole.PENDING,
  ];
  return roles[Math.floor(Math.random() * roles.length)];
};

// Hash password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Default departments
const defaultDepartments = [
  { name: "IT", description: "Information Technology Department" },
  { name: "HR", description: "Human Resources Department" },
  { name: "Engineering", description: "Engineering Department" },
  { name: "Finance", description: "Finance Department" },
  { name: "Marketing", description: "Marketing Department" },
];

// Default document types
const defaultDocumentTypes = [
  { name: "PDF", description: "Portable Document Format" },
  { name: "DOCX", description: "Microsoft Word Document" },
  { name: "TXT", description: "Plain Text Document" },
  { name: "XLS", description: "Microsoft Excel Spreadsheet" },
];

// Generate fake user data
const createFakeUser = async (departmentIds: string[]) => {
  const role = getRandomRole();
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role,
    password: await hashPassword(faker.internet.password()),
    departmentId:
      role === UserRole.PENDING
        ? null
        : faker.helpers.arrayElement(departmentIds),
  };
};

// Generate fake document data
const createFakeDocument = (
  userId: string,
  departmentIds: string[],
  documentTypeIds: string[]
) => {
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
    typeId: faker.helpers.arrayElement(documentTypeIds),
    description: faker.lorem.paragraph(),
    departmentId: faker.helpers.arrayElement(departmentIds),
    status: DocumentStatus.PENDING,
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
    password: "bob",
  },
  {
    email: "approver@example.com",
    name: "Approver User",
    role: UserRole.APPROVER,
    password: "approver123",
  },
  {
    email: "submitter@example.com",
    name: "Submitter User",
    role: UserRole.SUBMITTER,
    password: "submitter123",
  },
  {
    email: "pending@example.com",
    name: "Pending User",
    role: UserRole.PENDING,
    password: "pending123",
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
    await prisma.department.deleteMany();
    await prisma.documentType.deleteMany();
  }

  // Create departments
  console.log("Creating departments...");
  const departments = await Promise.all(
    defaultDepartments.map((dept) => prisma.department.create({ data: dept }))
  );
  const departmentIds = departments.map((d) => d.id);

  // Create document types
  console.log("Creating document types...");
  const documentTypes = await Promise.all(
    defaultDocumentTypes.map((type) =>
      prisma.documentType.create({ data: type })
    )
  );
  const documentTypeIds = documentTypes.map((d) => d.id);

  if (args["use-faker"]) {
    console.log(`Generating ${args.count} fake records...`);

    // Create users
    const users = await Promise.all(
      Array.from({ length: args.count }, async () => {
        const userData = await createFakeUser(departmentIds);
        return await prisma.user.create({ data: userData });
      })
    );

    // Create documents and randomly assign approvers for some documents
    const approvers = users.filter((user) => user.role === UserRole.APPROVER);

    await Promise.all(
      users
        .filter(
          (user) =>
            user.role === UserRole.SUBMITTER || user.role === UserRole.PENDING
        )
        .flatMap((user) =>
          Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            async () => {
              const documentData = createFakeDocument(
                user.id,
                departmentIds,
                documentTypeIds
              );
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
            departmentId:
              userData.role === UserRole.PENDING
                ? null
                : faker.helpers.arrayElement(departmentIds),
          },
        });
      })
    );

    // Create some default documents
    await Promise.all([
      prisma.document.create({
        data: {
          name: "Sample Document 1.pdf",
          typeId: documentTypes[0].id, // PDF type
          description: "A sample document for testing",
          departmentId: departments[0].id, // IT department
          status: DocumentStatus.PENDING,
          content: Buffer.from("Sample document content 1"),
          mimeType: "application/pdf",
          submitterId: users[2].id, // Assign to submitter user
          approverId: users[1].id, // Assign to approver user
        },
      }),
      prisma.document.create({
        data: {
          name: "Sample Document 2.docx",
          typeId: documentTypes[1].id, // DOCX type
          description: "Another sample document",
          departmentId: departments[1].id, // HR department
          status: DocumentStatus.APPROVED,
          content: Buffer.from("Sample document content 2"),
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          submitterId: users[2].id, // Assign to submitter user
          approverId: users[1].id, // Assign to approver user
        },
      }),
    ]);
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

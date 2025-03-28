import {
  PrismaClient,
  UserRole,
  DocumentStatus,
  FeedbackStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedArgs {
  "use-faker": boolean;
  count: number;
  clear: boolean;
  destructive: boolean;
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
      destructive: {
        alias: "d",
        type: "boolean",
        description:
          "Required flag when using --clear to confirm destructive operation",
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
    UserRole.REPORTER,
  ];
  return roles[Math.floor(Math.random() * roles.length)];
};

// Generate a random document status
const getRandomStatus = (): DocumentStatus => {
  const statuses = [
    DocumentStatus.PENDING,
    DocumentStatus.APPROVED,
    DocumentStatus.REJECTED,
    DocumentStatus.NEEDS_REVIEW,
  ];
  return faker.helpers.arrayElement(statuses);
};

// Generate a random feedback status
const getRandomFeedbackStatus = (): FeedbackStatus => {
  const statuses = [
    FeedbackStatus.PENDING,
    FeedbackStatus.REVIEWED,
    FeedbackStatus.RESOLVED,
  ];
  return faker.helpers.arrayElement(statuses);
};

// Hash password using bcrypt
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Default site ID (matches the one created in the migration)
const DEFAULT_SITE_ID = "default-site-id";

// Default departments
const defaultDepartments = [
  {
    name: "IT",
    description: "Information Technology Department",
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "HR",
    description: "Human Resources Department",
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "Engineering",
    description: "Engineering Department",
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "Finance",
    description: "Finance Department",
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "Marketing",
    description: "Marketing Department",
    siteId: DEFAULT_SITE_ID,
  },
];

// Default document types
const defaultDocumentTypes = [
  {
    name: "PDF",
    description: "Portable Document Format",
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "DOCX",
    description: "Microsoft Word Document",
    siteId: DEFAULT_SITE_ID,
  },
  { name: "TXT", description: "Plain Text Document", siteId: DEFAULT_SITE_ID },
  {
    name: "XLS",
    description: "Microsoft Excel Spreadsheet",
    siteId: DEFAULT_SITE_ID,
  },
];

// Default templates
const defaultTemplates = [
  {
    name: "Leave Request Form.docx",
    description: "Standard template for requesting leave",
    content: Buffer.from("Leave Request Form Template Content"),
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    departmentId: null, // Global template
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "Expense Report.xlsx",
    description: "Template for submitting expense reports",
    content: Buffer.from("Expense Report Template Content"),
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    departmentId: null, // Global template
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "IT Request Form.pdf",
    description: "Form for requesting IT equipment or support",
    content: Buffer.from("IT Request Form Template Content"),
    mimeType: "application/pdf",
    departmentId: null, // Will be set to IT department
    siteId: DEFAULT_SITE_ID,
  },
  {
    name: "HR Onboarding Checklist.docx",
    description: "Checklist for new employee onboarding",
    content: Buffer.from("HR Onboarding Checklist Template Content"),
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    departmentId: null, // Will be set to HR department
    siteId: DEFAULT_SITE_ID,
  },
];

// Generate fake user data
const createFakeUser = async (
  departmentIds: string[],
  siteId: string = DEFAULT_SITE_ID
) => {
  const role = getRandomRole();
  const password = `${role.toLowerCase()}pass`;
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    name: `${firstName} ${lastName}`,
    role,
    password: await hashPassword(password),
    departmentId:
      role === UserRole.PENDING || departmentIds.length === 0
        ? null
        : faker.helpers.arrayElement(departmentIds),
    siteId,
  };
};

// Generate fake document data
const createFakeDocument = (
  userId: string,
  departmentIds: string[],
  documentTypeIds: string[],
  siteId: string = DEFAULT_SITE_ID
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
  const status = getRandomStatus();

  // Ensure we have at least one document type
  if (documentTypeIds.length === 0) {
    throw new Error("Cannot create document without document types");
  }

  return {
    name: `${faker.system.fileName()}.${fileType.ext}`,
    typeId: faker.helpers.arrayElement(documentTypeIds),
    description: faker.lorem.paragraph(),
    departmentId:
      departmentIds.length > 0
        ? faker.helpers.arrayElement(departmentIds)
        : null,
    status,
    content,
    mimeType: fileType.mime,
    submitterId: userId,
    siteId,
  };
};

// Generate fake template data
const createFakeTemplate = (
  departmentIds: string[],
  documentTypeIds: string[],
  siteId: string = DEFAULT_SITE_ID
) => {
  const fileTypes = [
    { ext: "pdf", mime: "application/pdf" },
    {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    {
      ext: "xlsx",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ];

  const fileType = faker.helpers.arrayElement(fileTypes);

  // Ensure we have at least one document type
  if (documentTypeIds.length === 0) {
    throw new Error("Cannot create template without document types");
  }

  return {
    name: `${faker.word.words(3)} Template.${fileType.ext}`,
    description: faker.lorem.sentence(),
    content: Buffer.from(faker.lorem.paragraphs()),
    mimeType: fileType.mime,
    departmentId:
      departmentIds.length > 0 && Math.random() > 0.5
        ? faker.helpers.arrayElement(departmentIds)
        : null,
    typeId: faker.helpers.arrayElement(documentTypeIds),
    siteId,
  };
};

// Default seed data when not using faker
const defaultUsers = [
  {
    email: "bob@bob.bob",
    name: "Bob",
    role: UserRole.ADMIN,
    password: "adminpass",
    siteId: DEFAULT_SITE_ID,
  },
  {
    email: "approver@example.com",
    name: "Approver User",
    role: UserRole.APPROVER,
    password: "approverpass",
    siteId: DEFAULT_SITE_ID,
  },
  {
    email: "submitter@example.com",
    name: "Submitter User",
    role: UserRole.SUBMITTER,
    password: "submitterpass",
    siteId: DEFAULT_SITE_ID,
  },
  {
    email: "pending@example.com",
    name: "Pending User",
    role: UserRole.PENDING,
    password: "pendingpass",
    siteId: DEFAULT_SITE_ID,
  },
  {
    email: "reporter@example.com",
    name: "Reporter User",
    role: UserRole.REPORTER,
    password: "reporterpass",
    siteId: DEFAULT_SITE_ID,
  },
];

async function main() {
  const args = await parseArgs();

  console.log("Seeding database with options:", {
    useFaker: args["use-faker"],
    count: args.count,
    clear: args.clear,
    destructive: args.destructive,
  });

  // Check if database is empty
  const userCount = await prisma.user.count();
  const departmentCount = await prisma.department.count();
  const documentTypeCount = await prisma.documentType.count();
  const isDbEmpty =
    userCount === 0 && departmentCount === 0 && documentTypeCount === 0;

  // Check if site exists, create if not
  let defaultSite = await prisma.site.findFirst({
    where: { id: DEFAULT_SITE_ID },
  });

  if (!defaultSite) {
    console.log("Creating default site...");
    defaultSite = await prisma.site.create({
      data: {
        id: DEFAULT_SITE_ID,
        name: "Default Site",
        description: "Default site for the application",
      },
    });
  }

  // Handle clear operation with destructive flag check
  if (args.clear) {
    if (!args.destructive) {
      console.error("Error: --destructive flag is required when using --clear");
      console.error("This is to prevent accidental data loss.");
      console.error("Use: npx ts-node prisma/seed.ts --clear --destructive");
      process.exit(1);
    }

    console.log("Clearing existing data...");
    await prisma.comment.deleteMany();
    await prisma.document.deleteMany();
    await prisma.template.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
    await prisma.documentType.deleteMany();
    await prisma.feedback.deleteMany();
    // Don't delete the site as we'll need it
  } else if (!isDbEmpty) {
    console.log("Database already contains data. Running in idempotent mode.");
    console.log("To clear existing data, use --clear --destructive flags.");
  }

  // Create or get departments
  console.log("Setting up departments...");
  let departments = [];
  let departmentIds = [];

  if (departmentCount === 0) {
    // Create departments if none exist
    departments = await Promise.all(
      defaultDepartments.map((dept) => prisma.department.create({ data: dept }))
    );
  } else {
    // Get existing departments
    departments = await prisma.department.findMany();
    console.log(`Found ${departments.length} existing departments`);
  }
  departmentIds = departments.map((d) => d.id);

  // Create or get document types
  console.log("Setting up document types...");
  let documentTypes = [];
  let documentTypeIds = [];

  if (documentTypeCount === 0) {
    // Create document types if none exist
    documentTypes = await Promise.all(
      defaultDocumentTypes.map((type) =>
        prisma.documentType.create({ data: type })
      )
    );
  } else {
    // Get existing document types
    documentTypes = await prisma.documentType.findMany();
    console.log(`Found ${documentTypes.length} existing document types`);
  }
  documentTypeIds = documentTypes.map((d) => d.id);

  // Check if templates exist
  const templateCount = await prisma.template.count();

  // Create default templates if none exist
  if (templateCount === 0) {
    console.log("Creating default templates...");
    await Promise.all(
      defaultTemplates.map((template, index) =>
        prisma.template.create({
          data: {
            ...template,
            departmentId:
              index >= 2 && departments.length > 0
                ? departments[Math.min(index - 2, departments.length - 1)].id
                : null,
            typeId: documentTypes[index % documentTypes.length].id,
          },
        })
      )
    );
  } else {
    console.log(`Found ${templateCount} existing templates`);
  }

  // Check if admin user exists
  const adminExists = await prisma.user.findFirst({
    where: { email: defaultUsers[0].email },
  });

  let bob;
  if (!adminExists) {
    // Create admin user if doesn't exist
    console.log("Creating Bob (admin user)...");
    const bobData = defaultUsers[0];
    const hashedBobPassword = await hashPassword(bobData.password);
    bob = await prisma.user.create({
      data: {
        ...bobData,
        password: hashedBobPassword,
        departmentId: departments.length > 0 ? departments[0].id : null, // Assign Bob to IT department if it exists
      },
    });
  } else {
    console.log("Admin user already exists");
    bob = adminExists;
  }

  // Check if we need to create additional data
  const existingUserCount = await prisma.user.count();
  const existingDocumentCount = await prisma.document.count();

  // Check if count parameter was explicitly passed
  const countExplicitlyProvided = process.argv.some(
    (arg) => arg === "--count" || arg === "-n"
  );

  // Log non-idempotent mode when count is explicitly provided
  if (countExplicitlyProvided && !isDbEmpty && existingUserCount > 1) {
    console.log(
      "Count parameter explicitly provided. Running in non-idempotent mode."
    );
    console.log(
      `Will add ${args.count} new records regardless of existing data.`
    );
  }

  // Create additional data if we're clearing, DB is empty, few users exist, or count was explicitly provided
  if (
    args.clear ||
    isDbEmpty ||
    existingUserCount <= 1 ||
    countExplicitlyProvided
  ) {
    if (args["use-faker"]) {
      // Calculate how many additional users to create
      // If count was explicitly provided, use that exact number, otherwise calculate the difference
      const additionalCount = countExplicitlyProvided
        ? args.count
        : Math.max(0, args.count - (existingUserCount - 1));
      if (additionalCount > 0) {
        console.log(`Generating ${additionalCount} fake records...`);

        // Create additional users
        const users = await Promise.all(
          Array.from({ length: additionalCount }, async () => {
            const userData = await createFakeUser(departmentIds);
            return await prisma.user.create({ data: userData });
          })
        );

        // Get all users including existing ones for document creation
        const allUsers = await prisma.user.findMany();
        const approvers = allUsers.filter(
          (user) => user.role === UserRole.APPROVER
        );

        // Create documents and randomly assign approvers for some documents
        await Promise.all(
          allUsers
            .filter(
              (user) =>
                user.role === UserRole.SUBMITTER ||
                user.role === UserRole.PENDING
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

        // Create additional fake templates
        console.log("Creating fake templates...");
        await Promise.all(
          Array.from({ length: Math.floor(additionalCount / 2) }, async () => {
            const templateData = createFakeTemplate(
              departmentIds,
              documentTypeIds
            );
            return await prisma.template.create({ data: templateData });
          })
        );

        // Create feedback entries
        console.log("Creating feedback entries...");
        await Promise.all(
          allUsers.flatMap((user) =>
            Array.from(
              { length: Math.floor(Math.random() * 3) + 1 }, // 1-3 feedback entries per user
              async () => {
                return await prisma.feedback.create({
                  data: {
                    content: faker.lorem.paragraph(),
                    userId: user.id,
                    siteId: DEFAULT_SITE_ID,
                    status: getRandomFeedbackStatus(),
                  },
                });
              }
            )
          )
        );
      } else {
        console.log("Database already has sufficient fake data");
      }
    } else if (existingUserCount <= 1) {
      console.log("Creating default seed data...");

      // Create remaining default users with hashed passwords
      const existingEmails = (await prisma.user.findMany()).map((u) => u.email);
      const usersToCreate = defaultUsers
        .slice(1)
        .filter((u) => !existingEmails.includes(u.email));

      const users = await Promise.all(
        usersToCreate.map(async (userData) => {
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

      // Only create sample documents if none exist
      if (existingDocumentCount === 0 && users.length > 0) {
        // Create some default documents with random statuses
        await Promise.all([
          prisma.document.create({
            data: {
              name: "Sample Document 1.pdf",
              typeId: documentTypes[0].id, // PDF type
              description: "A sample document for testing",
              departmentId: departments.length > 0 ? departments[0].id : null, // IT department if it exists
              status: getRandomStatus(),
              content: Buffer.from("Sample document content 1"),
              mimeType: "application/pdf",
              submitterId: users[0].id, // Assign to first created user
              approverId: bob.id, // Assign to admin user
              siteId: DEFAULT_SITE_ID,
            },
          }),
          prisma.document.create({
            data: {
              name: "Sample Document 2.docx",
              typeId: documentTypes[1].id, // DOCX type
              description: "Another sample document",
              departmentId:
                departments.length > 1
                  ? departments[1].id
                  : departments.length > 0
                    ? departments[0].id
                    : null, // HR department if it exists, otherwise IT, or null
              status: getRandomStatus(),
              content: Buffer.from("Sample document content 2"),
              mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              submitterId: users[0].id, // Assign to first created user
              approverId: bob.id, // Assign to admin user
              siteId: DEFAULT_SITE_ID,
            },
          }),
        ]);

        // Create some default feedback entries
        console.log("Creating default feedback entries...");
        await Promise.all([
          prisma.feedback.create({
            data: {
              content:
                "This application is very helpful for document management!",
              userId: users[0].id,
              siteId: DEFAULT_SITE_ID,
              status: FeedbackStatus.PENDING,
            },
          }),
          prisma.feedback.create({
            data: {
              content: "Would be nice to have a dark mode option.",
              userId: users[1].id,
              siteId: DEFAULT_SITE_ID,
              status: FeedbackStatus.REVIEWED,
            },
          }),
          prisma.feedback.create({
            data: {
              content: "The approval process is very streamlined, great job!",
              userId: users[2].id,
              siteId: DEFAULT_SITE_ID,
              status: FeedbackStatus.RESOLVED,
            },
          }),
        ]);
      }
    } else {
      console.log("Database already has sufficient default data");
    }
  } else {
    console.log(
      "Database already populated, skipping additional data creation"
    );
    console.log(
      `Current counts: ${existingUserCount} users, ${existingDocumentCount} documents`
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

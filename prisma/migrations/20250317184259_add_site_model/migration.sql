/*
  Warnings:

  - A unique constraint covering the columns `[name,siteId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,siteId]` on the table `DocumentType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Department_name_key";

-- DropIndex
DROP INDEX "DocumentType_name_key";

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- Create default site
INSERT INTO "Site" ("id", "name", "description", "createdAt", "updatedAt")
VALUES ('default-site-id', 'default-site', 'Default site', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- AlterTable: Add siteId columns with default value
ALTER TABLE "Department" ADD COLUMN "siteId" TEXT;
ALTER TABLE "Document" ADD COLUMN "siteId" TEXT;
ALTER TABLE "DocumentType" ADD COLUMN "siteId" TEXT;
ALTER TABLE "Feedback" ADD COLUMN "siteId" TEXT;
ALTER TABLE "Template" ADD COLUMN "siteId" TEXT;
ALTER TABLE "User" ADD COLUMN "siteId" TEXT;

-- Update existing records to use default site
UPDATE "Department" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;
UPDATE "Document" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;
UPDATE "DocumentType" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;
UPDATE "Feedback" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;
UPDATE "Template" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;
UPDATE "User" SET "siteId" = 'default-site-id' WHERE "siteId" IS NULL;

-- Make siteId NOT NULL for tables where it's required
ALTER TABLE "Department" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "DocumentType" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "Feedback" ALTER COLUMN "siteId" SET NOT NULL;
ALTER TABLE "Template" ALTER COLUMN "siteId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_siteId_key" ON "Department"("name", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_name_siteId_key" ON "DocumentType"("name", "siteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentType" ADD CONSTRAINT "DocumentType_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

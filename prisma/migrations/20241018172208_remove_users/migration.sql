/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Approval" DROP CONSTRAINT "Approval_approverId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_createdBy_fkey";

-- AlterTable
ALTER TABLE "Approval" ALTER COLUMN "approverId" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "createdBy" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "User";

/*
  Warnings:

  - You are about to drop the column `department` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "department",
DROP COLUMN "type",
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
ADD COLUMN     "departmentId" TEXT;

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_name_key" ON "DocumentType"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

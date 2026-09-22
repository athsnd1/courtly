/*
  Warnings:

  - The values [FIRM_CREATED] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FIRM] on the enum `NoteVisibility` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `firmId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `firmId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Firm` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orgId,caseNumber]` on the table `Case` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('ORG_CREATED', 'CASE_CREATED', 'DOCUMENT_UPLOADED', 'LAWYER_ASSIGNED', 'TASK_ASSIGNED', 'STATUS_CHANGED', 'HEARING_SCHEDULED');
ALTER TABLE "CaseEvent" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NoteVisibility_new" AS ENUM ('PRIVATE', 'ORGANIZATION');
ALTER TABLE "Note" ALTER COLUMN "visibility" TYPE "NoteVisibility_new" USING ("visibility"::text::"NoteVisibility_new");
ALTER TYPE "NoteVisibility" RENAME TO "NoteVisibility_old";
ALTER TYPE "NoteVisibility_new" RENAME TO "NoteVisibility";
DROP TYPE "public"."NoteVisibility_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_firmId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_firmId_fkey";

-- DropIndex
DROP INDEX "Case_firmId_caseNumber_key";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "firmId",
ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firmId",
ADD COLUMN     "orgId" TEXT;

-- DropTable
DROP TABLE "Firm";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_clerkOrgId_key" ON "Organization"("clerkOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "Case_orgId_caseNumber_key" ON "Case"("orgId", "caseNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

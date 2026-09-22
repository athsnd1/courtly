/*
  Warnings:

  - Added the required column `createdBy` to the `Hearing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'HEARING_DELETED';

-- AlterTable
ALTER TABLE "Hearing" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Hearing" ADD CONSTRAINT "Hearing_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

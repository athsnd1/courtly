/*
  Warnings:

  - You are about to drop the column `description` on the `CaseEvent` table. All the data in the column will be lost.
  - Added the required column `action` to the `CaseEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseEvent" DROP COLUMN "description",
ADD COLUMN     "action" TEXT NOT NULL;

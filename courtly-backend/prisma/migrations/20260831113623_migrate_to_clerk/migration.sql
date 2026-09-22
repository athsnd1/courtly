/*
  Warnings:

  - You are about to drop the column `firebaseUid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkOrgId]` on the table `Firm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkOrgId` to the `Firm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_firebaseUid_key";

-- AlterTable
ALTER TABLE "Firm" ADD COLUMN     "clerkOrgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firebaseUid",
DROP COLUMN "role",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Firm_clerkOrgId_key" ON "Firm"("clerkOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_firmId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firmId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

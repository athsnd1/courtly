-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'DOCUMENT_DELETED';

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_caseId_fkey";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

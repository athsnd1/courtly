/*
  Warnings:

  - The values [ORG_CREATED] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('CASE_CREATED', 'LAWYER_ASSIGNED', 'TASK_ASSIGNED', 'STATUS_CHANGED', 'HEARING_SCHEDULED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DELETED');
ALTER TABLE "CaseEvent" ALTER COLUMN "type" TYPE "EventType_new" USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CaseEvent" DROP CONSTRAINT "CaseEvent_caseId_fkey";

-- DropForeignKey
ALTER TABLE "CaseLawyer" DROP CONSTRAINT "CaseLawyer_caseId_fkey";

-- DropForeignKey
ALTER TABLE "CaseParty" DROP CONSTRAINT "CaseParty_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Hearing" DROP CONSTRAINT "Hearing_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_caseId_fkey";

-- AddForeignKey
ALTER TABLE "CaseLawyer" ADD CONSTRAINT "CaseLawyer_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseParty" ADD CONSTRAINT "CaseParty_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseEvent" ADD CONSTRAINT "CaseEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hearing" ADD CONSTRAINT "Hearing_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

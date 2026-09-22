/*
  Warnings:

  - You are about to drop the column `url` on the `Document` table. All the data in the column will be lost.
  - Added the required column `path` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "url",
ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `taxDeclarationHistoryId` on the `Dependents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dependents" DROP CONSTRAINT "Dependents_taxDeclarationHistoryId_fkey";

-- AlterTable
ALTER TABLE "Dependents" DROP COLUMN "taxDeclarationHistoryId";

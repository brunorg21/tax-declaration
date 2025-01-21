/*
  Warnings:

  - You are about to drop the column `taxDeclarationHistoryId` on the `Dependents` table. All the data in the column will be lost.
  - Added the required column `dependentsHistory` to the `TaxDeclarationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dependents" DROP CONSTRAINT "Dependents_taxDeclarationHistoryId_fkey";

-- AlterTable
ALTER TABLE "Dependents" DROP COLUMN "taxDeclarationHistoryId";

-- AlterTable
ALTER TABLE "TaxDeclarationHistory" ADD COLUMN     "dependentsHistory" JSONB NOT NULL;

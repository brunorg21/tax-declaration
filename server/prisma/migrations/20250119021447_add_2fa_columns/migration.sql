/*
  Warnings:

  - Made the column `taxDeclarationId` on table `Dependents` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `twoFactorEnableSecret` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twoFactorEnabled` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dependents" DROP CONSTRAINT "Dependents_taxDeclarationId_fkey";

-- AlterTable
ALTER TABLE "Dependents" ALTER COLUMN "taxDeclarationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnableSecret" TEXT NOT NULL,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Dependents" ADD CONSTRAINT "Dependents_taxDeclarationId_fkey" FOREIGN KEY ("taxDeclarationId") REFERENCES "TaxDeclaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

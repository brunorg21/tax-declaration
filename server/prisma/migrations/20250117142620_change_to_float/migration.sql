/*
  Warnings:

  - The `alimony` column on the `TaxDeclaration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `medicalExpenses` on the `TaxDeclaration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `educationExpenses` on the `TaxDeclaration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `earnings` on the `TaxDeclaration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `socialSecurityContribution` on the `TaxDeclaration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `complementarySocialSecurityContribution` on the `TaxDeclaration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TaxDeclaration" DROP COLUMN "medicalExpenses",
ADD COLUMN     "medicalExpenses" DOUBLE PRECISION NOT NULL,
DROP COLUMN "educationExpenses",
ADD COLUMN     "educationExpenses" DOUBLE PRECISION NOT NULL,
DROP COLUMN "earnings",
ADD COLUMN     "earnings" DOUBLE PRECISION NOT NULL,
DROP COLUMN "alimony",
ADD COLUMN     "alimony" DOUBLE PRECISION,
DROP COLUMN "socialSecurityContribution",
ADD COLUMN     "socialSecurityContribution" DOUBLE PRECISION NOT NULL,
DROP COLUMN "complementarySocialSecurityContribution",
ADD COLUMN     "complementarySocialSecurityContribution" DOUBLE PRECISION NOT NULL;

/*
  Warnings:

  - The values [UNSUBMMITED,SUBMMITED] on the enum `TaxDeclarationTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaxDeclarationTypes_new" AS ENUM ('UNSUBMITTED', 'SUBMITTED');
ALTER TABLE "TaxDeclaration" ALTER COLUMN "status" TYPE "TaxDeclarationTypes_new" USING ("status"::text::"TaxDeclarationTypes_new");
ALTER TYPE "TaxDeclarationTypes" RENAME TO "TaxDeclarationTypes_old";
ALTER TYPE "TaxDeclarationTypes_new" RENAME TO "TaxDeclarationTypes";
DROP TYPE "TaxDeclarationTypes_old";
COMMIT;

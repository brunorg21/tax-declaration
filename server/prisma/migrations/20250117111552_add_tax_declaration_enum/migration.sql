/*
  Warnings:

  - Added the required column `status` to the `TaxDeclaration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaxDeclarationTypes" AS ENUM ('UNSUBMMITED', 'SUBMMITED');

-- AlterTable
ALTER TABLE "TaxDeclaration" ADD COLUMN     "status" "TaxDeclarationTypes" NOT NULL;

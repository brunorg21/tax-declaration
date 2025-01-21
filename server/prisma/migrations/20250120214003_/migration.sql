/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Dependents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Dependents" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dependents_email_key" ON "Dependents"("email");

-- AlterTable
ALTER TABLE "Dependents" ADD COLUMN     "taxDeclarationHistoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Dependents" ADD CONSTRAINT "Dependents_taxDeclarationHistoryId_fkey" FOREIGN KEY ("taxDeclarationHistoryId") REFERENCES "TaxDeclarationHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

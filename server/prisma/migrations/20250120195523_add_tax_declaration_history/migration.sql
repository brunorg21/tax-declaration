-- AlterTable
ALTER TABLE "Dependents" ADD COLUMN     "taxDeclarationHistoryId" TEXT;

-- CreateTable
CREATE TABLE "TaxDeclarationHistory" (
    "id" TEXT NOT NULL,
    "medicalExpenses" DOUBLE PRECISION NOT NULL,
    "educationExpenses" DOUBLE PRECISION NOT NULL,
    "earnings" DOUBLE PRECISION NOT NULL,
    "alimony" DOUBLE PRECISION,
    "socialSecurityContribution" DOUBLE PRECISION NOT NULL,
    "complementarySocialSecurityContribution" DOUBLE PRECISION NOT NULL,
    "status" "TaxDeclarationTypes" NOT NULL,
    "userId" TEXT NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxDeclarationId" TEXT NOT NULL,

    CONSTRAINT "TaxDeclarationHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dependents" ADD CONSTRAINT "Dependents_taxDeclarationHistoryId_fkey" FOREIGN KEY ("taxDeclarationHistoryId") REFERENCES "TaxDeclarationHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxDeclarationHistory" ADD CONSTRAINT "TaxDeclarationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxDeclarationHistory" ADD CONSTRAINT "TaxDeclarationHistory_taxDeclarationId_fkey" FOREIGN KEY ("taxDeclarationId") REFERENCES "TaxDeclaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

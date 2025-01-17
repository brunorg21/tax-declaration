-- CreateTable
CREATE TABLE "Dependents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "taxDeclarationId" TEXT,

    CONSTRAINT "Dependents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dependents_cpf_key" ON "Dependents"("cpf");

-- AddForeignKey
ALTER TABLE "Dependents" ADD CONSTRAINT "Dependents_taxDeclarationId_fkey" FOREIGN KEY ("taxDeclarationId") REFERENCES "TaxDeclaration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

import { Prisma, TaxDeclaration } from '@prisma/client';

export abstract class TaxDeclarationRepository {
  abstract save(
    taxDeclaration: Prisma.TaxDeclarationCreateInput,
  ): Promise<void>;
  abstract findManyByYear(
    userId: string,
    year: number,
  ): Promise<TaxDeclaration[]>;
  abstract findUnique(taxDeclarationId: string): Promise<TaxDeclaration | null>;
  abstract update(
    data: Prisma.TaxDeclarationUpdateInput,
    taxDeclarationId: string,
  ): Promise<void>;
}

import { Prisma, TaxDeclaration } from '@prisma/client';

export abstract class TaxDeclarationRepository {
  abstract save(
    taxDeclaration: Prisma.TaxDeclarationCreateInput,
  ): Promise<void>;
  abstract findManyByUserId(userId: string): Promise<TaxDeclaration[]>;
  abstract findUnique(taxDeclarationId: string): Promise<TaxDeclaration | null>;
  abstract update(
    data: Prisma.TaxDeclarationUpdateInput,
    taxDeclarationId: string,
  ): Promise<void>;
}

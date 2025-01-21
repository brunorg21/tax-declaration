import { Prisma, TaxDeclarationHistory } from '@prisma/client';

export abstract class TaxDeclarationHistoryRepository {
  abstract save(
    taxDeclarationHistory: Prisma.TaxDeclarationHistoryUncheckedCreateInput,
  ): Promise<void>;
  abstract findManyByOriginalTaxDeclaration(
    taxDeclarationId: string,
  ): Promise<TaxDeclarationHistory[]>;
  abstract findUniqueByTaxDeclarationId(
    taxDeclarationId: string,
  ): Promise<TaxDeclarationHistory | null>;
  abstract update(data: TaxDeclarationHistory): Promise<void>;
}

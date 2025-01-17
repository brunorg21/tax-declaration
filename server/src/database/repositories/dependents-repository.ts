import { Dependents, Prisma } from '@prisma/client';

export abstract class DependentsRepository {
  abstract save(
    dependents: Prisma.DependentsUncheckedCreateInput,
  ): Promise<void>;
  abstract findManyByTaxDeclarationId(
    taxDeclarationId: string,
  ): Promise<Dependents[]>;
}

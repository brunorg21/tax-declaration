import { Dependents, Prisma } from '@prisma/client';

export abstract class DependentsRepository {
  abstract save(
    dependents: Prisma.DependentsUncheckedCreateInput,
  ): Promise<void>;
  abstract findManyByTaxDeclarationId(
    taxDeclarationId: string,
  ): Promise<Dependents[]>;
  abstract findByCpfAndEmail(cpf: string): Promise<Dependents | null>;

  abstract delete(dependentId: string): Promise<void>;
  abstract update(dependent: Dependents): Promise<void>;
}

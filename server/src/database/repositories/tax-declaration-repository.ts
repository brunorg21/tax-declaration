import {
  CreateTaxDeclarationRequest,
  UpdateTaxDeclarationRequest,
} from '@/tax-declaration/tax-declaration.service';
import { Dependents, TaxDeclaration } from '@prisma/client';

export interface TaxDeclarationWithDependents extends TaxDeclaration {
  dependents: Dependents[];
}

export abstract class TaxDeclarationRepository {
  abstract save(taxDeclaration: CreateTaxDeclarationRequest): Promise<void>;
  abstract findManyByYear(
    userId: string,
    year: number,
  ): Promise<TaxDeclaration[]>;
  abstract findUnique(
    taxDeclarationId: string,
  ): Promise<TaxDeclarationWithDependents | null>;
  abstract update(
    data: UpdateTaxDeclarationRequest,
    taxDeclarationId: string,
  ): Promise<void>;

  abstract findById(taxDeclarationId: string): Promise<TaxDeclaration | null>;
}

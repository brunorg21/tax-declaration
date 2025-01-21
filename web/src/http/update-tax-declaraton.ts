import { TaxDeclarationType } from "../components/tax-declaration/tax-declaration-form";
import { api } from "../lib/axios";

export async function updateTaxDeclaration(
  data: TaxDeclarationType,
  taxDeclarationId: string
) {
  return await api.put(`/tax-declarations/${taxDeclarationId}`, data);
}

import { TaxDeclarationType } from "../components/tax-declaration/tax-declaration-form";
import { api } from "../lib/axios";

export async function createTaxDeclaration(data: TaxDeclarationType) {
  return await api.post("/tax-declarations", data);
}

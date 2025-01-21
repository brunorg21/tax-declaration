import { api } from "../lib/axios";
import { Declaration } from "../models/declaration";

interface GetTaxDeclarationsRequest {
  year?: number;
}

export async function getTaxDeclarationsHistory({
  year,
}: GetTaxDeclarationsRequest): Promise<Declaration[]> {
  const response = await api.get(`/tax-declarations/history?year=${year}`);

  return response.data;
}

import { Dependent } from "./dependent";

export interface Declaration {
  id: string;
  createdAt: string;
  medicalExpenses: number;
  educationExpenses: number;
  earnings: number;
  alimony: number;
  socialSecurityContribution: number;
  complementarySocialSecurityContribution: number;
  status: "UNSUBMITTED" | "SUBMITTED" | "RECTIFIED";
  userId: string;
  dependents: Dependent[];
  taxDeclarationHistories: Declaration[];
  dependentsHistory: string;
}

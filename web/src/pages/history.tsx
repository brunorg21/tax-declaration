import { Link, useNavigate } from "react-router-dom";
import { HistoryFilter } from "../components/history-filter";
import { TaxDeclarationCard } from "../components/tax-declaration/tax-declaration-card";
import { useState } from "react";
import { TaxDeclarationForm } from "../components/tax-declaration/tax-declaration-form";
import { useAuth } from "../contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getTaxDeclarationsHistory } from "../http/get-tax-declarations-history";
import { Declaration } from "../models/declaration";

// const data = [
//   {
//     id: "bedc7251-f406-48a1-a1ba-c005f51b3a09",
//     createdAt: "2025-01-17T21:09:43.932Z",
//     medicalExpenses: 2000.5,
//     educationExpenses: 1500.75,
//     earnings: 50000,
//     alimony: 1000,
//     socialSecurityContribution: 3000,
//     complementarySocialSecurityContribution: 500,
//     status: "UNSUBMITTED",
//     userId: "cf40f24e-9249-4ab3-a12d-c002b7c43da2",
//     dependents: [
//       {
//         id: "f098f94f-f606-40df-8f0a-ebd49acb051a",
//         name: "John Doe",
//         cpf: "123.456.789-00",
//         email: "jhon@doe.com",
//         birthDate: new Date(),
//         taxDeclarationId: "bedc7251-f406-48a1-a1ba-c005f51b3a09",
//       },
//     ],
//   },
//   {
//     id: "cedc7251-f406-48a1-a1ba-c005f51b3a10",
//     createdAt: "2024-01-17T21:09:43.932Z",
//     medicalExpenses: 1800.5,
//     educationExpenses: 1300.75,
//     earnings: 48000,
//     alimony: 900,
//     socialSecurityContribution: 2800,
//     complementarySocialSecurityContribution: 450,
//     status: "SUBMITTED",
//     userId: "cf40f24e-9249-4ab3-a12d-c002b7c43da2",
//     dependents: [],
//   },
// ];
export default function History() {
  const { logOut, user } = useAuth();

  const [showTaxDeclarationModal, setShowTaxDeclarationModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [declarationToEdit, setDeclarationToEdit] =
    useState<Declaration | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery<Declaration[]>({
    queryKey: [`tax-declarations-history-${selectedYear}`],
    queryFn: () =>
      getTaxDeclarationsHistory({
        year: selectedYear,
      }),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Histórico de Declarações - {user?.name}
          </h1>
          <div className="flex items-center gap-4">
            {!user?.twoFactorEnabled && (
              <Link
                to={"/2fa-setup"}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Configurar 2FA
              </Link>
            )}
            <button
              onClick={() => {
                logOut();
                navigate("/session/sign-in");
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        <HistoryFilter
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <button
          type="button"
          onClick={() => {
            setShowTaxDeclarationModal(true);
            setDeclarationToEdit(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Nova Declaração
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data && data.length > 0 ? (
            data.map((declaration) => (
              <TaxDeclarationCard
                setDeclarationToEdit={setDeclarationToEdit}
                setShowTaxDeclarationModal={setShowTaxDeclarationModal}
                key={declaration.id}
                declaration={declaration}
              />
            ))
          ) : isLoading ? (
            <p className="text-gray-600 text-xl">
              Carregando suas declarações...
            </p>
          ) : (
            <p className="text-gray-600 text-xl">
              Nenhuma declaração encontrada.
            </p>
          )}
        </div>
      </div>

      {showTaxDeclarationModal && (
        <TaxDeclarationForm
          selectedYear={selectedYear}
          setShowTaxDeclarationModal={setShowTaxDeclarationModal}
          declarationToEdit={declarationToEdit}
        />
      )}
    </div>
  );
}

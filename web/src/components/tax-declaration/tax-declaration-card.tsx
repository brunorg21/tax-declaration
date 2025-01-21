import { Declaration } from "../../models/declaration";
import { formatCurrency } from "../../utils/format-currency";
import { formatDate } from "../../utils/format-date";

interface TaxDeclarationCardProps {
  declaration: Declaration;
  setShowTaxDeclarationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDeclarationToEdit: React.Dispatch<
    React.SetStateAction<Declaration | null>
  >;
}

export function TaxDeclarationCard({
  declaration,
  setShowTaxDeclarationModal,
  setDeclarationToEdit,
}: TaxDeclarationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNSUBMITTED":
        return "bg-yellow-100 text-yellow-800";
      case "SUBMITTED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      key={declaration.id}
      className="flex flex-col justify-between bg-white shadow-md rounded-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            {formatDate(declaration.createdAt)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              declaration.status
            )}`}
          >
            {declaration.status === "UNSUBMITTED"
              ? "NÃO SUBMETIDA"
              : "SUBMETIDA"}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Declaração de {new Date(declaration.createdAt).getFullYear()}
        </h2>
        <div className="space-y-2">
          <p>
            <strong>Rendimentos:</strong> {formatCurrency(declaration.earnings)}
          </p>
          <p>
            <strong>Despesas Médicas:</strong>{" "}
            {formatCurrency(declaration.medicalExpenses)}
          </p>
          <p>
            <strong>Despesas Educacionais:</strong>{" "}
            {formatCurrency(declaration.educationExpenses)}
          </p>
          <p>
            <strong>Pensão Alimentícia:</strong>{" "}
            {formatCurrency(declaration.alimony)}
          </p>
          <p>
            <strong>Contribuição Previdenciária:</strong>{" "}
            {formatCurrency(declaration.socialSecurityContribution)}
          </p>
          <p>
            <strong>Previdência Complementar:</strong>{" "}
            {formatCurrency(
              declaration.complementarySocialSecurityContribution
            )}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Dependentes:</h3>
          <ul className="list-disc list-inside">
            {declaration.dependents.map((dependent) => (
              <li key={dependent.id}>{dependent.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
        {declaration.status !== "SUBMITTED" && (
          <button
            type="button"
            onClick={() => {
              setShowTaxDeclarationModal(true);
              setDeclarationToEdit(declaration);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ver detalhes
          </button>
        )}
        {declaration.status === "SUBMITTED" && (
          <button
            type="button"
            onClick={() => {
              setShowTaxDeclarationModal(true);
              setDeclarationToEdit(declaration);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retificar
          </button>
        )}
      </div>
    </div>
  );
}

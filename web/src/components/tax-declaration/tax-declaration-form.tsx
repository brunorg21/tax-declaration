import { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { createTaxDeclaration } from "../../http/create-tax-declaration";
import { toast } from "react-toastify";
import { queryClient } from "../../lib/query-client";
import { Declaration } from "../../models/declaration";
import InputMask from "react-input-mask";

import { NumericInput } from "../numeric-input";
import { updateTaxDeclaration } from "../../http/update-tax-declaraton";
import { AxiosError, AxiosResponse } from "axios";
import { Input } from "../input";
import { formatCurrency } from "../../utils/format-currency";
import { Dependent } from "../../models/dependent";
import { PreviousValueBadge } from "./previous-value-badge";
import { format } from "date-fns";

interface TaxDeclarationFormProps {
  setShowTaxDeclarationModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number;
  declarationToEdit: Declaration | null;
}

const createTaxDeclarationSchema = z.object({
  medicalExpenses: z
    .number({
      message: "Campo obrigatório",
    })
    .nonnegative({
      message: "Valores negativos não são permitidos",
    }),
  educationExpenses: z
    .number({
      message: "Campo obrigatório",
    })
    .nonnegative({
      message: "Valores negativos não são permitidos",
    }),
  earnings: z
    .number({
      message: "Campo obrigatório",
    })
    .nonnegative({
      message: "Valores negativos não são permitidos",
    }),
  alimony: z
    .number()
    .nonnegative({
      message: "Valores negativos não são permitidos",
    })
    .default(0),
  socialSecurityContribution: z
    .number()
    .nonnegative({
      message: "Valores negativos não são permitidos",
    })
    .default(0),
  complementarySocialSecurityContribution: z
    .number()
    .nonnegative({
      message: "Valores negativos não são permitidos",
    })
    .default(0),
  status: z
    .enum(["UNSUBMITTED", "SUBMITTED", "RECTIFIED"])
    .default("UNSUBMITTED"),
  dependents: z
    .array(
      z.object({
        name: z.string().nonempty({
          message: "O nome é obrigatório",
        }),
        cpf: z
          .string({
            message: "Informe o cpf",
          })
          .regex(
            // eslint-disable-next-line no-useless-escape
            /^(?!000\.000\.000\-00)(?!111\.111\.111\-11)(?!222\.222\.222\-22)(?!333\.333\.333\-33)(?!444\.444\.444\-44)(?!555\.555\.555\-55)(?!666\.666\.666\-66)(?!777\.777\.777\-77)(?!888\.888\.888\-88)(?!999\.999\.999\-99)\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
            {
              message: "CPF inválido",
            }
          ),
        email: z
          .string()
          .nullable()
          .refine(
            (val) => val === "" || z.string().email().safeParse(val).success,
            {
              message: "E-mail inválido",
            }
          ),
        birthDate: z.coerce.date({
          message: "Informe a data de nascimento",
        }),
      })
    )
    .optional()
    .default([]),
});

export type TaxDeclarationType = z.infer<typeof createTaxDeclarationSchema>;

export function TaxDeclarationForm({
  setShowTaxDeclarationModal,
  selectedYear,
  declarationToEdit,
}: TaxDeclarationFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaxDeclarationType>({
    resolver: zodResolver(createTaxDeclarationSchema),
    defaultValues: {
      alimony: declarationToEdit?.alimony ?? 0,
      complementarySocialSecurityContribution:
        declarationToEdit?.complementarySocialSecurityContribution ?? 0,
      socialSecurityContribution:
        declarationToEdit?.socialSecurityContribution ?? 0,
      dependents:
        declarationToEdit?.dependents.map((e) => {
          return {
            birthDate: new Date(e.birthDate),
            cpf: e.cpf,
            email: e.email,
            name: e.name,
          };
        }) ?? [],
      medicalExpenses: declarationToEdit?.medicalExpenses,
      educationExpenses: declarationToEdit?.educationExpenses,
      earnings: declarationToEdit?.earnings,
      status: declarationToEdit?.status ?? "UNSUBMITTED",
    },
  });

  const dependentsHistory = JSON.parse(
    declarationToEdit?.taxDeclarationHistories[0]?.dependentsHistory || "[]"
  ) as Dependent[];

  const { fields, remove, append } = useFieldArray({
    control,
    name: "dependents",
  });

  const { mutate: createTaxDeclarationMutate } = useMutation({
    mutationKey: ["createTaxDeclaration"],
    mutationFn: createTaxDeclaration,
    onSuccess: () => {
      toast("Declaração cadastrada com sucesso!", { type: "success" });
      queryClient.invalidateQueries({
        queryKey: [`tax-declarations-history-${selectedYear}`],
      });
      setShowTaxDeclarationModal(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast(error.response.data.message, { type: "error" });
        } else {
          toast("Erro ao cadastrar declaração", { type: "error" });
        }
      }
    },
  });

  const { mutate: updateTaxDeclarationMutate } = useMutation<
    AxiosResponse,
    unknown,
    TaxDeclarationType,
    unknown
  >({
    mutationKey: ["updateTaxDeclaration"],
    mutationFn: (data) => {
      return updateTaxDeclaration(data, declarationToEdit?.id || "");
    },
    onSuccess: () => {
      toast("Declaração atualizada com sucesso!", { type: "success" });
      queryClient.invalidateQueries({
        queryKey: [`tax-declarations-history-${selectedYear}`],
      });
      setShowTaxDeclarationModal(false);
    },
    onError: () => {
      toast("Erro ao atualizar declaração", { type: "error" });
    },
  });

  async function handleCreateTaxDeclaration(data: TaxDeclarationType) {
    if (declarationToEdit) {
      updateTaxDeclarationMutate(data);
    } else {
      createTaxDeclarationMutate(data);
    }
  }

  const isSubmitted = declarationToEdit?.status === "SUBMITTED";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[400px] h-[700px] p-4 rounded-md overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Cadastrar Declaração</h1>
        <form
          onSubmit={handleSubmit(handleCreateTaxDeclaration)}
          className="space-y-4"
        >
          <div>
            <label className="flex items-center gap-2 font-medium">
              Despesas Médicas
              {isSubmitted &&
                declarationToEdit?.taxDeclarationHistories[0]
                  ?.medicalExpenses !== declarationToEdit?.medicalExpenses && (
                  <PreviousValueBadge
                    value={formatCurrency(
                      declarationToEdit?.taxDeclarationHistories[0]
                        ?.medicalExpenses
                    )}
                  />
                )}
            </label>
            <Controller
              name="medicalExpenses"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder="R$ 0,00"
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.medicalExpenses && (
              <span className="text-red-500">
                {errors.medicalExpenses.message}
              </span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium">
              Despesas Educacionais
              {isSubmitted && (
                <PreviousValueBadge
                  value={formatCurrency(
                    declarationToEdit?.taxDeclarationHistories[0]?.earnings
                  )}
                />
              )}
            </label>
            <Controller
              name="educationExpenses"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  placeholder="R$ 0,00"
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.educationExpenses && (
              <span className="text-red-500">
                {errors.educationExpenses.message}
              </span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium">
              Ganhos
              {isSubmitted &&
                declarationToEdit?.taxDeclarationHistories[0]?.earnings !==
                  declarationToEdit?.earnings && (
                  <PreviousValueBadge
                    value={formatCurrency(
                      declarationToEdit?.taxDeclarationHistories[0]?.earnings
                    )}
                  />
                )}
            </label>
            <Controller
              name="earnings"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  placeholder="R$ 0,00"
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.earnings && (
              <span className="text-red-500">{errors.earnings.message}</span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium">
              Pensão Alimentícia
              {isSubmitted &&
                declarationToEdit?.taxDeclarationHistories[0]?.alimony !==
                  declarationToEdit?.alimony && (
                  <PreviousValueBadge
                    value={formatCurrency(
                      declarationToEdit?.taxDeclarationHistories[0]?.alimony
                    )}
                  />
                )}
            </label>
            <Controller
              name="alimony"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.alimony && (
              <span className="text-red-500">{errors.alimony.message}</span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium">
              Contribuição à Previdência Social
              {isSubmitted &&
                declarationToEdit?.taxDeclarationHistories[0]
                  ?.socialSecurityContribution !==
                  declarationToEdit?.socialSecurityContribution && (
                  <PreviousValueBadge
                    value={formatCurrency(
                      declarationToEdit?.taxDeclarationHistories[0]
                        ?.socialSecurityContribution
                    )}
                  />
                )}
            </label>
            <Controller
              name="socialSecurityContribution"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.socialSecurityContribution && (
              <span className="text-red-500">
                {errors.socialSecurityContribution.message}
              </span>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium">
              Contribuição à Previdência Complementar
              {isSubmitted &&
                declarationToEdit?.taxDeclarationHistories[0]
                  ?.complementarySocialSecurityContribution !==
                  declarationToEdit?.complementarySocialSecurityContribution && (
                  <PreviousValueBadge
                    value={formatCurrency(
                      declarationToEdit?.taxDeclarationHistories[0]
                        ?.complementarySocialSecurityContribution
                    )}
                  />
                )}
            </label>
            <Controller
              name="complementarySocialSecurityContribution"
              control={control}
              render={({ field }) => (
                <NumericInput
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="border rounded w-full p-2"
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.complementarySocialSecurityContribution && (
              <span className="text-red-500">
                {errors.complementarySocialSecurityContribution.message}
              </span>
            )}
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  disabled={!declarationToEdit}
                  className="rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  {...field}
                >
                  <option value="SUBMITTED">Submetida</option>
                  <option value="UNSUBMITTED">Não submetida</option>
                </select>
              )}
            />
            {errors.status && (
              <span className="text-red-500">{errors.status.message}</span>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold mb-2">Dependentes</h2>
            {fields.map((item, index) => {
              const { birthDate, cpf, name, email } =
                dependentsHistory[index] || {};

              const birthDateFormatted = birthDate
                ? format(birthDate, "dd/MM/yyyy")
                : "";

              return (
                <div key={item.id} className="border p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Dependente {index + 1}
                  </h3>

                  <div>
                    <label className="flex items-center gap-2 font-medium">
                      Nome{" "}
                      {isSubmitted && item.name !== name && (
                        <PreviousValueBadge value={name} />
                      )}
                    </label>
                    <Controller
                      name={`dependents.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Nome do dependente" />
                      )}
                    />
                    {errors?.dependents?.[index]?.name && (
                      <span className="text-red-500">
                        {errors.dependents[index].name?.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-medium">
                      CPF{" "}
                      {isSubmitted && item.cpf !== cpf && (
                        <PreviousValueBadge value={cpf} />
                      )}
                    </label>
                    <Controller
                      name={`dependents.${index}.cpf`}
                      control={control}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          type="text"
                          className="border rounded w-full p-2"
                          placeholder="CPF"
                          mask="999.999.999-99"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        >
                          {(inputProps) => (
                            <Input {...inputProps} type="text" />
                          )}
                        </InputMask>
                      )}
                    />
                    {errors?.dependents?.[index]?.cpf && (
                      <span className="text-red-500">
                        {errors.dependents[index].cpf?.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-medium">
                      Email (opcional)
                      {isSubmitted && item.email !== email && (
                        <PreviousValueBadge value={email || ""} />
                      )}
                    </label>
                    <Controller
                      name={`dependents.${index}.email`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          className="border rounded w-full p-2"
                          placeholder="Email do dependente"
                          value={field.value || ""}
                        />
                      )}
                    />
                    {errors?.dependents?.[index]?.email && (
                      <span className="text-red-500">
                        {errors.dependents[index].email?.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 font-medium">
                      Data de Nascimento
                      {isSubmitted &&
                        format(new Date(item.birthDate), "dd/MM/yyyy") !==
                          birthDateFormatted && (
                          <PreviousValueBadge
                            value={birthDate?.toString().split("T")[0] || ""}
                          />
                        )}
                    </label>
                    <Controller
                      name={`dependents.${index}.birthDate`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                          type="date"
                          className="border rounded w-full p-2"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          defaultValue={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : field.value
                          }
                        />
                      )}
                    />
                    {errors?.dependents?.[index]?.birthDate && (
                      <span className="text-red-500">
                        {errors.dependents[index].birthDate?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Remover Dependente
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                append({ name: "", cpf: "", email: "", birthDate: new Date() });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Adicionar Dependente
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isSubmitted
                ? "Retificar declaração"
                : declarationToEdit
                ? "Atualizar declaração"
                : "Cadastrar declaração"}
            </button>
            <button
              onClick={() => setShowTaxDeclarationModal(false)}
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

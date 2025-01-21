import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../http/sign-up";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const signUpSchema = z.object({
  email: z
    .string({
      message: "O email é obrigatório",
    })
    .email({
      message: "Insira um email válido.",
    }),
  password: z
    .string({
      message: "A senha é obrigatória",
    })
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres",
    }),
  name: z
    .string()
    .nonempty({
      message: "O nome é obrigatório",
    })
    .max(20, {
      message: "O nome deve ter no máximo 20 caracteres",
    }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUp() {
  const { register, handleSubmit, formState } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const navigate = useNavigate();

  const { mutate: signUpMutate, isPending } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: signUp,
    onSuccess: () => {
      navigate("/session/sign-in");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast("Email já cadastrado", { type: "error" });
        } else {
          toast("Erro ao criar conta", { type: "error" });
        }
      }
    },
  });

  function handleSignUp({ email, password, name }: SignUpSchema) {
    signUpMutate({ email, password, name });
  }

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Crie sua conta!
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
        <div className="rounded-md shadow-sm space-y-2">
          <div>
            <label htmlFor="username">Nome de usuário</label>
            <Input
              type="text"
              placeholder="Nome de usuário"
              {...register("name")}
            />
            {formState.errors.name && (
              <span className="text-red-500">
                {formState.errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="email-address">Endereço de email</label>
            <Input
              type="email"
              autoComplete="email"
              placeholder="Endereço de email"
              {...register("email")}
            />
            {formState.errors.email && (
              <span className="text-red-500">
                {formState.errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Senha"
              {...register("password")}
            />
            {formState.errors.password && (
              <span className="text-red-500">
                {formState.errors.password.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isPending ? "Criando conta..." : "Criar conta"}
          </button>
        </div>
      </form>
    </>
  );
}

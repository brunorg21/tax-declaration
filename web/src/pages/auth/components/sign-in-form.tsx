import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../../components/input";
import { useAuth } from "../../../contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";

const signInSchema = z.object({
  email: z.string().email({
    message: "Insira um email válido",
  }),
  password: z.string().nonempty({
    message: "A senha precisa ser preenchida",
  }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { signInMutate } = useAuth();
  const navigate = useNavigate();

  async function handleSignIn({ email, password }: SignInSchema) {
    try {
      await signInMutate({ email, password });

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Faça login na sua conta
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignIn)}>
        <div className="rounded-md shadow-sm space-y-2">
          <div>
            <label htmlFor="email-address">Endereço de email</label>
            <Input
              id="email-address"
              type="email"
              autoComplete="email"
              placeholder="Endereço de email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Senha"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          <Link
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            to={"/session/sign-up"}
          >
            Não tem uma conta? Cadastre-se!
          </Link>
        </div>
      </form>
    </>
  );
}

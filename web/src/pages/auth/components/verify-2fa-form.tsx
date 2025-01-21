import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../../components/input";
import { useMutation } from "@tanstack/react-query";
import { signInWith2fa } from "../../../http/sign-in-with-2fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useAuth } from "../../../contexts/auth-context";

const verify2FASchema = z.object({
  code: z.string(),
});

type Verify2FASchema = z.infer<typeof verify2FASchema>;

export function Verify2FAForm() {
  const { user } = useAuth();

  const cookie = new Cookies();
  const { register, handleSubmit } = useForm<Verify2FASchema>({
    resolver: zodResolver(verify2FASchema),
  });

  const navigate = useNavigate();

  const { mutate: signInWith2faMutate } = useMutation({
    mutationFn: signInWith2fa,
    mutationKey: ["signInWith2FA"],
    onError: (error) => {
      console.log(error);
      toast("Código Inválido", { type: "error" });
    },
    onSuccess: ({ data }) => {
      cookie.set("access_token", data.access_token, { path: "/" });

      navigate("/");
    },
  });

  function handleVerify2FA({ code }: Verify2FASchema) {
    signInWith2faMutate({ token: code, userId: user?.id || "" });
  }
  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Verificação de dois fatores
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleVerify2FA)}>
        <div className="rounded-md shadow-sm space-y-2">
          <div>
            <label htmlFor="password">Código</label>
            <Input type="text" placeholder="Código" {...register("code")} />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enviar
          </button>
        </div>
      </form>
    </>
  );
}

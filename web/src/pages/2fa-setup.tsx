import { useState } from "react";
import { useAuth } from "../contexts/auth-context";

import { generate2faCode } from "../http/generate-2fa-code";
import { verify2faCode } from "../http/verify-2fa-code";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const { user } = useAuth();

  const navigate = useNavigate();

  const { mutate: verify2faCodeMutate } = useMutation({
    mutationFn: verify2faCode,
    mutationKey: ["verify2faCode"],
    onSuccess: () => {
      toast("2FA ativado com sucesso!", { type: "success" });
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast("Código Inválido", { type: "error" });
      }
    },
  });

  async function generateQrCode() {
    const response = await generate2faCode(user?.email || "");

    if (response.status === 200) {
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">
        Configurar Autenticação de Dois Fatores
      </h2>
      {!qrCode && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={generateQrCode}
        >
          Gerar QR Code
        </button>
      )}
      {qrCode && (
        <div>
          <p>Escaneie o QR Code abaixo com seu app 2FA:</p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
      {qrCode && (
        <div className="flex flex-col items-start gap-2">
          <p>Depois de escanear, insira o código gerado:</p>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Digite o código 2FA"
            className="p-2"
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => verify2faCodeMutate({ secret, token })}
          >
            Verificar Código
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;

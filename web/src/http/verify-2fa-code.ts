import { api } from "../lib/axios";

interface Verify2faCodeRequest {
  secret: string | null;
  token: string | null;
}

export async function verify2faCode(data: Verify2faCodeRequest) {
  return await api.post("/auth/verify-2fa-code", data);
}

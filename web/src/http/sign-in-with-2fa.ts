import { api } from "../lib/axios";

interface SignInWith2faRequest {
  token: string;
  userId: string;
}

export async function signInWith2fa(data: SignInWith2faRequest) {
  return await api.post("/auth/sign-in-with-2fa", data);
}

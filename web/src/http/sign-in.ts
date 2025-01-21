import { api } from "../lib/axios";
import { SignInSchema } from "../pages/auth/components/sign-in-form";

export function signIn(data: SignInSchema) {
  return api.post("/auth/sign-in", data);
}

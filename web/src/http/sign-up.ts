import { SignUpSchema } from "../pages/auth/sign-up";
import { api } from "../lib/axios";

export async function signUp(data: SignUpSchema) {
  return await api.post("/users", data);
}

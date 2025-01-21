import { api } from "../lib/axios";

export async function generate2faCode(email: string) {
  return await api.get(`/auth/generate-2fa-code?email=${email}`);
}

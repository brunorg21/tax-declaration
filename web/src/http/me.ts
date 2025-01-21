import { api } from "../lib/axios";

export async function me() {
  return await api.get("/users/me");
}

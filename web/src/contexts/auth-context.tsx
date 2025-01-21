import { AxiosError, AxiosResponse } from "axios";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "../models/user";
import { UseMutateAsyncFunction, useMutation } from "@tanstack/react-query";
import { signIn } from "../http/sign-in";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { api } from "../lib/axios";
import { me } from "../http/me";
import { redirect } from "react-router-dom";

interface AuthContextProps {
  signInMutate: UseMutateAsyncFunction<
    AxiosResponse<unknown, unknown>,
    Error,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  user: User | null;
  logOut(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const now = new Date();
  const expires = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  const cookie = new Cookies(null, { path: "/", expires });

  useEffect(() => {
    if (cookie.get("access_token")) {
      api.defaults.headers.common["Authorization"] = `Bearer ${cookie.get(
        "access_token"
      )}`;
      me()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          cookie.remove("access_token");
          toast("Sua sessão expirou", { type: "error" });
          redirect("/session/sign-in");
        });
    }
  }, []);

  async function logOut() {
    cookie.remove("access_token");
    cookie.remove("user-allowed");
    setUser(null);
  }

  const { mutateAsync: signInMutate } = useMutation({
    mutationFn: signIn,
    mutationKey: ["signIn"],
    onSuccess({ data }) {
      if (!data.twoFactorEnabled) {
        cookie.set("access_token", data.access_token, { path: "/" });

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
      }
      setUser(data);
    },

    onError(error) {
      if (error instanceof AxiosError) {
        toast("Credenciais Inválidas", { type: "error" });
      }
    },
  });

  return (
    <AuthContext.Provider value={{ signInMutate, user, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

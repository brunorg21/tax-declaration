import { Navigate } from "react-router-dom";

import Cookies from "universal-cookie";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const cookies = new Cookies();
  const token = cookies.get("access_token");

  if (!token) {
    return <Navigate to="/session/sign-in" replace />;
  }

  return children;
}

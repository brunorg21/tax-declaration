import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./layouts/auth-layout";
import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";

import History from "./pages/history";
import TwoFactorSetup from "./pages/2fa-setup";
import { RequireAuth } from "./require-auth";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <History />
      </RequireAuth>
    ),
  },
  {
    path: "2fa-setup",
    element: (
      <RequireAuth>
        <TwoFactorSetup />
      </RequireAuth>
    ),
  },
  {
    path: "/session",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
]);

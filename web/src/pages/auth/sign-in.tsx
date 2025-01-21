import { useAuth } from "../../contexts/auth-context";
import { SignInForm } from "./components/sign-in-form";
import { Verify2FAForm } from "./components/verify-2fa-form";

export function SignIn() {
  const { user } = useAuth();

  return <>{!user?.twoFactorEnabled ? <SignInForm /> : <Verify2FAForm />}</>;
}

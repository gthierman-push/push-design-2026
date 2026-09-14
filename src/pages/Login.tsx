import { useLocation, useNavigate } from "react-router";

import { useAuth } from "../auth";
import { LoginForm } from "@components/login-form";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where the guard bounced us from, if anywhere.
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? "/";

  return (
    <LoginForm
      onSubmit={(event) => {
        event.preventDefault();
        signIn();
        navigate(from, { replace: true });
      }}
    />
  );
}

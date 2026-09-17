import { useNavigate } from "react-router";

import { useAuth } from "../../auth";
import { LoginForm } from "@components/login-form";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  return (
    <LoginForm
      onSubmit={(event) => {
        event.preventDefault();
        signIn();
        navigate("/", { replace: true });
      }}
    />
  );
}

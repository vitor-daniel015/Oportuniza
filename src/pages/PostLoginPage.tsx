import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  applyPendingGoogleRole,
  getPostLoginPath,
} from "../service/LoginService";
import { postLoginRedirectKey } from "../service/ReviewInvitationService";

export function PostLoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    applyPendingGoogleRole()
      .then(() => {
        const redirect = sessionStorage.getItem(postLoginRedirectKey);
        if (redirect) {
          sessionStorage.removeItem(postLoginRedirectKey);
          return redirect;
        }
        return getPostLoginPath();
      })
      .then((path) => navigate(path, { replace: true }))
      .catch(() => navigate("/prestadores", { replace: true }));
  }, [user, navigate]);
  if (!loading && !user) return <Navigate to="/entrar" replace />;
  return (
    <main className="grid min-h-screen place-items-center text-text-secondary">
      Preparando sua conta...
    </main>
  );
}

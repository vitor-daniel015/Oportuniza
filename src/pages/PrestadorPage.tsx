import { Navigate, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Prestador } from "../components/PrestadorPage/Prestador";
import { useAuth } from "../contexts/AuthContext";

export function PrestadorPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/entrar" replace />;
  return (
    <div className="min-h-screen color-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <Prestador />
      <Footer />
    </div>
  );
}
export default PrestadorPage;

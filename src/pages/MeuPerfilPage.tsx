import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { MeuPerfil } from "../components/MeuPerfilPage/MeuPerfil";
import { Navbar } from "../components/Navbar";

export function MeuPerfilPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => navigate("/entrar")} />
      <MeuPerfil />
      <Footer />
    </div>
  );
}

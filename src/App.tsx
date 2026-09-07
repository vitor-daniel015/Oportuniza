import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ContactPage } from "./pages/ContactPage";
import PrestadorPage from "./pages/PrestadorPage";
import { SingInPage } from "./pages/SingInPage";
import { SingUpPage } from "./pages/SingUpPage";
import { AuthProvider } from "./contexts/AuthContext";
import { PerfilPage } from "./pages/PerfilPage";
import { MeuPerfilPage } from "./pages/MeuPerfilPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/prestador" element={<PrestadorPage />} />
          <Route path="/prestadores" element={<PrestadorPage />} />
          <Route path="/prestador/:id" element={<PerfilPage />} />
          <Route path="/meu-perfil" element={<MeuPerfilPage />} />
          <Route path="/entrar" element={<SingInPage />} />
          <Route path="/cadastrar" element={<SingUpPage />} />
          <Route path="/termos-de-uso" element={<TermsPage />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

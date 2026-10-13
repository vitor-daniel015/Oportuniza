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
import { PostLoginPage } from "./pages/PostLoginPage";
import { LegalConsentGate } from "./components/LegalConsentGate";
import { RouteHistoryTracker } from "./components/RouteHistoryTracker";
import { ToastProvider } from "./contexts/ToastContext";
import { MetricsPage } from "./pages/MetricsPage";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <RouteHistoryTracker />
          <LegalConsentGate />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/prestador" element={<PrestadorPage />} />
            <Route path="/prestadores" element={<PrestadorPage />} />
            <Route path="/prestador/:id" element={<PerfilPage />} />
            <Route path="/meu-perfil" element={<MeuPerfilPage />} />
            <Route path="/metricas" element={<MetricsPage />} />
            <Route path="/entrar" element={<SingInPage />} />
            <Route path="/cadastrar" element={<SingUpPage />} />
            <Route path="/pos-login" element={<PostLoginPage />} />
            <Route path="/termos-de-uso" element={<TermsPage />} />
            <Route
              path="/politica-de-privacidade"
              element={<PrivacyPolicyPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

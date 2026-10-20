import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LegalConsentGate } from "./components/LegalConsentGate";
import { RouteHistoryTracker } from "./components/RouteHistoryTracker";
import { ToastProvider } from "./contexts/ToastContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrestadorPage = lazy(() => import("./pages/PrestadorPage"));
const SingInPage = lazy(() =>
  import("./pages/SingInPage").then((module) => ({ default: module.SingInPage })),
);
const SingUpPage = lazy(() =>
  import("./pages/SingUpPage").then((module) => ({ default: module.SingUpPage })),
);
const PerfilPage = lazy(() =>
  import("./pages/PerfilPage").then((module) => ({ default: module.PerfilPage })),
);
const MeuPerfilPage = lazy(() =>
  import("./pages/MeuPerfilPage").then((module) => ({ default: module.MeuPerfilPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage").then((module) => ({ default: module.PrivacyPolicyPage })),
);
const TermsPage = lazy(() =>
  import("./pages/TermsPage").then((module) => ({ default: module.TermsPage })),
);
const PostLoginPage = lazy(() =>
  import("./pages/PostLoginPage").then((module) => ({ default: module.PostLoginPage })),
);
const MetricsPage = lazy(() =>
  import("./pages/MetricsPage").then((module) => ({ default: module.MetricsPage })),
);
const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage").then((module) => ({ default: module.NotificationsPage })),
);
const InvitedReviewPage = lazy(() =>
  import("./pages/InvitedReviewPage").then((module) => ({ default: module.InvitedReviewPage })),
);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <RouteHistoryTracker />
          <LegalConsentGate />
          <Suspense
            fallback={
              <main className="grid min-h-[55vh] place-items-center text-text-secondary">
                Carregando página...
              </main>
            }
          >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/prestador" element={<PrestadorPage />} />
            <Route path="/prestadores" element={<PrestadorPage />} />
            <Route path="/prestador/:id" element={<PerfilPage />} />
            <Route path="/meu-perfil" element={<MeuPerfilPage />} />
            <Route path="/metricas" element={<MetricsPage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />
            <Route path="/avaliar/:token" element={<InvitedReviewPage />} />
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
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

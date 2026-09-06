import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ContactPage } from "./pages/ContactPage";
import PrestadorPage from "./pages/PrestadorPage";
import { SingInPage } from "./pages/SingInPage";
import { SingUpPage } from "./pages/SingUpPage";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/prestador" element={<PrestadorPage />} />
          <Route path="/prestadores" element={<PrestadorPage />} />
          <Route path="/entrar" element={<SingInPage />} />
          <Route path="/cadastrar" element={<SingUpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { previousRouteKey } from "./RouteHistoryTracker";

export function BackButton({
  fallback = "/",
  label = "Voltar",
}: {
  fallback?: string;
  label?: string;
  overlay?: boolean;
}) {
  const navigate = useNavigate();

  function goBack() {
    navigate(sessionStorage.getItem(previousRouteKey) || fallback, {
      replace: true,
    });
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="fixed left-3 top-3 z-80 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2 text-sm font-bold text-blue-depth shadow-lg backdrop-blur transition hover:border-blue-depth hover:bg-blue-50 active:scale-95 sm:left-5 sm:top-5"
      aria-label={`${label}. Retornar à página anterior`}
    >
      <ArrowLeft size={19} /> {label || "Voltar"}
    </button>
  );
}

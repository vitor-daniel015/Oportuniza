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
      className="relative z-30 m-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-blue-depth shadow-md transition hover:border-blue-depth hover:bg-blue-50 active:scale-95 sm:mx-5 md:fixed md:left-5 md:top-44 md:m-0 md:bg-white/95 md:shadow-lg md:backdrop-blur"
      aria-label={`${label}. Retornar à página anterior`}
    >
      <ArrowLeft size={19} /> {label || "Voltar"}
    </button>
  );
}

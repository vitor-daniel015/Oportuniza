import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton({
  fallback = "/",
  label = "Voltar",
  overlay = false,
}: {
  fallback?: string;
  label?: string;
  overlay?: boolean;
}) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-md transition active:scale-95 ${
        overlay
          ? "border border-white/60 bg-white text-blue-depth hover:bg-blue-50"
          : "border border-gray-200 bg-white text-blue-depth hover:border-blue-depth"
      }`}
      aria-label={`${label}. Retornar à página anterior`}
    >
      <ArrowLeft size={19} /> {label}
    </button>
  );
}

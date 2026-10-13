import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error" | "info";
type Toast = { id: string; message: string; kind: ToastKind };
type ToastContextValue = {
  notify: (message: string, kind?: ToastKind) => void;
};
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback(
    (id: string) =>
      setToasts((items) => items.filter((item) => item.id !== id)),
    [],
  );
  const notify = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items.slice(-2), { id, message, kind }]);
      window.setTimeout(() => remove(id), 5000);
    },
    [remove],
  );
  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-3 bottom-3 z-200 flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm"
        >
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onClose={() => remove(toast.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon =
    toast.kind === "success"
      ? CheckCircle2
      : toast.kind === "error"
        ? AlertCircle
        : Info;
  const colors =
    toast.kind === "success"
      ? "border-green-200 text-green-800"
      : toast.kind === "error"
        ? "border-red-200 text-red-800"
        : "border-blue-200 text-blue-depth";
  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${colors}`}
    >
      <Icon size={22} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm font-semibold leading-relaxed">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="rounded-full p-1 hover:bg-black/5"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}

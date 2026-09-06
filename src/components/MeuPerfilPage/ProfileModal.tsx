import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ProfileModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function ProfileModal({ title, onClose, children }: ProfileModalProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-[#10253b]/65 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl sm:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-full p-2 hover:bg-gray-100 sm:right-5 sm:top-5"
        >
          <X size={22} />
        </button>
        <h2 className="mb-6 max-w-[calc(100%-2.5rem)] text-2xl font-extrabold leading-tight text-text-title sm:mb-7 sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

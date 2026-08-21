// ContactInfoCard.tsx
import { LucideIcon } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  title: string;
  description?: string; // A interrogação indica que é opcional (o "Sobre Nós" não tem descrição)
}

export function ContactInfoCard({ icon: Icon, title, description }: ContactInfoCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex h-16 w-16 -translate-y-8 items-center justify-center rounded-full bg-blue-depth shadow-lg sm:mb-4 sm:-translate-y-0 sm:h-24 sm:w-24">
        <Icon className="h-7 w-7 text-white sm:h-10 sm:w-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-[10px] font-bold uppercase sm:text-sm">{title}</h3>
      {description && (
        <p className="mt-1 px-1 text-[9px] sm:text-sm">{description}</p>
      )}
    </div>
  );
}
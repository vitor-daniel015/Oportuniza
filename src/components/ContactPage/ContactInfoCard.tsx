import { LucideIcon } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function ContactInfoCard({
  icon: Icon,
  title,
  description,
}: ContactInfoCardProps) {
  return (
    <div className="flex min-w-0 flex-col items-center px-0.5 sm:px-2">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-depth shadow-lg sm:mb-4 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
        <Icon
          className="h-7 w-7 text-white sm:h-10 sm:w-10"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="text-[9px] font-bold uppercase sm:text-sm lg:text-lg">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-full px-0.5 text-[8px] leading-tight sm:px-1 sm:text-sm lg:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

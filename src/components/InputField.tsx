import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  type: string;
  placeholder: string;
}

export function InputField({
  label,
  id,
  type,
  placeholder,
  ...inputProps
}: InputFieldProps) {
  return (
    <div className="flex flex-col text-left">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 ml-4 text-xs font-medium text-gray-600"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...inputProps}
        className="rounded-full bg-[#dadada] px-5 py-3 outline-none transition-all focus:ring-2 focus:ring-blue-depth"
      />
    </div>
  );
}

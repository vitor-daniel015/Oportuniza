interface TextAreaFieldProps {
  id: string;
  rows: number;
  placeholder: string;
}

export function TextAreaField({ id, rows, placeholder }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col">
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 resize-none rounded-3xl bg-[#dadada] px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-blue-depth"
      />
    </div>
  );
}

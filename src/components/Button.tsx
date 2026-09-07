type ButtonProps = {
  title: string;
  color: string;
  colorHover: string;
  link: string;
};

export function ButtonOportuniza({
  title,
  color,
  colorHover,
  link,
}: ButtonProps) {
  return (
    <a
      href={link}
      className="mx-auto block w-fit rounded-md bg-{color} px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-{colorHover} lg:mx-0"
      style={{ backgroundColor: color }}
      onMouseEnter={(event) =>
        (event.currentTarget.style.backgroundColor = colorHover)
      }
      onMouseLeave={(event) =>
        (event.currentTarget.style.backgroundColor = color)
      }
    >
      {title}
    </a>
  );
}

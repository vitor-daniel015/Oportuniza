export function ButtonOportuniza({title, color, colorHover, link}) {
    return (
        <a
            href={link}
            className="mx-auto block w-fit rounded-md bg-{color} px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-{colorHover} lg:mx-0"
            style={{ backgroundColor: color, '--hover-color': colorHover, }}
        >
            {title}
        </a>
    )
}
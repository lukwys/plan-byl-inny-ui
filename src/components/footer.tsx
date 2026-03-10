import Link from "next/link";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="grid grid-cols-12 py-10 bg-main-red text-white">
      <div className="col-start-2 col-span-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <span className="font-eb-garamond">
          © {year} WysoccyDesigns. Wszelkie prawa zastrzeżone.
        </span>
        <div className="flex gap-6 text-sm font-light opacity-90">
          <Link
            href="/o-mnie"
            className="hover:text-gray-300 transition-colors"
          >
            O mnie
          </Link>
          <Link
            href="/kontakt"
            className="hover:text-gray-300 transition-colors"
          >
            Kontakt
          </Link>
          <Link
            href="/polityka-prywatnosci"
            className="hover:text-gray-300 transition-colors"
          >
            Polityka Prywatności
          </Link>
        </div>
      </div>
    </footer>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Strona Główna" },
  { href: "/about", label: "O mnie" },
  { href: "/contact", label: "Kontakt" },
];

export const Header = () => {
  const pathName = usePathname();

  return (
    <header className="grid grid-cols-12 py-10">
      <div className="col-start-2 col-span-2">tuBEDZIElogoKIEDYŚ.png</div>
      <nav className="col-start-9 col-span-3 flex justify-between">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm font-dm-sans ${
              pathName === href ? "text-main-red" : "text-black"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

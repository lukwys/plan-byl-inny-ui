"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HamburgerButton } from "./hamburger-button";

const navLinks = [
  { href: "/", label: "Strona Główna" },
  { href: "/o-mnie", label: "O mnie" },
  { href: "/kontakt", label: "Kontakt" },
];

export const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between gap-10 px-4 py-2 lg:grid lg:grid-cols-24 lg:px-0 lg:py-5">
        <div className="lg:col-span-4 lg:col-start-2">
          <Link href="/" className="block" aria-label="Go to homepage">
            <Image
              src="/logo.png"
              alt="Site logo"
              width={176}
              height={56}
              className="h-10 w-auto lg:h-14"
              priority
            />
          </Link>
        </div>
        <nav className="hidden lg:flex lg:col-start-18 lg:col-span-6 justify-end gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-dm-sans transition-colors hover:text-main-red-hover"
            >
              {label}
            </Link>
          ))}
        </nav>
        <HamburgerButton
          open={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
        />
      </div>
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-t z-50 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 py-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-dm-sans transition-colors ${
                pathname === href ? "text-main-red" : "text-black"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

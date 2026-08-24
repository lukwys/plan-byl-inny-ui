import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nie ma takiej strony | Plan był inny",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-5 bg-white px-4 py-24 text-center">
      <p className="font-dm-sans text-sm tracking-widest text-main-red">404</p>
      <h1 className="font-dm-sans text-3xl font-semibold">
        Tu plan też był inny
      </h1>
      <p className="font-eb-garamond max-w-prose text-lg">
        Ta strona nie istnieje albo zdążyła się przenieść. Wróć na stronę
        główną, tam czekają wszystkie wpisy.
      </p>
      <Link
        href="/"
        className="font-eb-garamond text-main-red hover:text-main-red-hover"
      >
        wróć na stronę główną →
      </Link>
    </main>
  );
}

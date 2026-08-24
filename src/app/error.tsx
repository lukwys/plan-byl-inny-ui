"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-5 bg-white px-4 py-24 text-center">
      <h1 className="font-dm-sans text-3xl font-semibold">
        Coś się popsuło po naszej stronie
      </h1>
      <p className="font-eb-garamond max-w-prose text-lg">
        Nie udało się wczytać treści. Spróbuj jeszcze raz — jeśli to nie
        pomoże, wróć za chwilę.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <button
          type="button"
          onClick={reset}
          className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="font-eb-garamond text-main-red hover:text-main-red-hover"
        >
          wróć na stronę główną →
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useSearchParams } from "next/navigation";

const STATUS_MESSAGES: Record<string, { text: string; isError: boolean }> = {
  confirmed: {
    text: "Zapis potwierdzony. Do usłyszenia, gdy plan znów okaże się inny!",
    isError: false,
  },
  expired: {
    text: "Ten link wygasł lub został już użyty. Zapisz się ponownie, a wyślemy nowy.",
    isError: true,
  },
  error: {
    text: "Nie udało się potwierdzić zapisu. Spróbuj ponownie za chwilę.",
    isError: true,
  },
};

export const NewsletterStatus = () => {
  const status = useSearchParams().get("newsletter");
  const message = status ? STATUS_MESSAGES[status] : undefined;

  if (!message) return null;

  return (
    <div
      role="status"
      className={`px-4 py-3 text-center text-sm font-semibold text-white ${
        message.isError ? "bg-main-red" : "bg-emerald-700"
      }`}
    >
      {message.text}
    </div>
  );
};

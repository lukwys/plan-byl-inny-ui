"use client";

import { useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      content: String(formData.get("content") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data?.error ?? "Coś poszło nie tak.");
      return;
    }

    setStatus("success");
    setMessage("Dzięki! Wiadomość wysłana.");
    form.reset();
  };

  return (
    <form className="mt-10 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="sr-only">Imię</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Imię*"
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </label>

        <label className="block">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail*"
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </label>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />

      <label className="mt-6 block">
        <span className="sr-only">Wiadomość</span>
        <textarea
          name="content"
          required
          placeholder="Wiadomość..."
          className="h-48 w-full resize-none border border-neutral-200 bg-white px-5 py-4 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </label>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        {message ? (
          <p
            className={`text-sm ${
              status === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          {status === "sending" ? "Wysyłanie..." : "Wyślij"}
        </button>
      </div>
    </form>
  );
};

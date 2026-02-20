"use client";

import { contactFormSchema } from "@/lib/validation/schemas";
import { useState } from "react";

export const ContactForm = () => {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const isSubmitting = status === "sending";
  const isButtonDisabled = isSubmitting || !isFormValid;

  const buildPayloadFromForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    return {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      content: String(formData.get("content") ?? ""),
      hp: String(formData.get("hp") ?? ""), // honeypot
    };
  };

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);

    setIsFormValid(contactFormSchema.safeParse(payload).success);

    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);

    const parsed = contactFormSchema.safeParse(payload);

    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues?.[0]?.message ?? "Uzupełnij formularz.");
      setIsFormValid(false);
      return;
    }

    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.ok === false) {
      setStatus("error");
      setMessage(String(data?.error ?? "Coś poszło nie tak."));
      return;
    }

    setStatus("success");
    setMessage(String(data?.message ?? "Dzięki! Wiadomość wysłana."));
    form.reset();
    setIsFormValid(false);
  };

  return (
    <form
      className="mt-10 w-full"
      onSubmit={handleSubmit}
      onInput={handleFormInput}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="sr-only">Imię</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Imię*"
            disabled={isSubmitting}
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
        </label>
        <label className="block">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail*"
            disabled={isSubmitting}
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
        </label>
      </div>
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="mt-6 block">
        <span className="sr-only">Wiadomość</span>
        <textarea
          name="content"
          required
          placeholder="Wiadomość..."
          disabled={isSubmitting}
          className="h-48 w-full resize-none border border-neutral-200 bg-white px-5 py-4 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
        />
      </label>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        {message ? (
          <p
            className={`text-sm ${
              status === "success" ? "text-green-700" : "text-red-700"
            }`}
            role="status"
            aria-live="polite"
          >
            {isSubmitting ? "Wysyłanie..." : message}
          </p>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          {isSubmitting ? "Wysyłanie..." : "Wyślij"}
        </button>
      </div>
    </form>
  );
};

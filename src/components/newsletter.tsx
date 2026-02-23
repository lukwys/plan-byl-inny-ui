"use client";

import { newsletterSchema } from "@/lib/validation/schemas";
import { useState } from "react";

export const Newsletter = () => {
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
      email: String(formData.get("email") ?? ""),
      hp: String(formData.get("hp") ?? ""),
    };
  };

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);

    setIsFormValid(newsletterSchema.safeParse(payload).success);

    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);

    const parsed = newsletterSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues?.[0]?.message ?? "Uzupełnij formularz.");
      setIsFormValid(false);
      return;
    }

    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/newsletter", {
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
    setMessage(
      String(
        data?.message ??
          "Super! Sprawdź skrzynkę, jeśli poproszę o potwierdzenie.",
      ),
    );
    form.reset();
    setIsFormValid(false);
  };

  return (
    <div className="text-center">
      <h3 className="font-dm-sans font-semibold text-xl mb-4">
        Gdzie jesteśmy?
      </h3>
      <p className="font-eb-garamond mb-4">
        Zostaw maila, a dam Ci znać, gdy pojawi się nowa historia o tym, jak
        życie zweryfikowało moje plany.
      </p>
      <form onSubmit={handleSubmit} onInput={handleFormInput}>
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
        {/* honeypot */}
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="mt-3 min-h-[20px]">
          {status !== "idle" ? (
            <p
              className={`text-sm ${
                status === "success"
                  ? "text-green-700"
                  : status === "error"
                    ? "text-red-700"
                    : "text-neutral-600"
              }`}
              role="status"
              aria-live="polite"
            >
              {isSubmitting ? "Zapisywanie..." : message}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {isSubmitting ? "Zapisywanie..." : "Wchodzę w to!"}
          </button>
        </div>
      </form>
    </div>
  );
};

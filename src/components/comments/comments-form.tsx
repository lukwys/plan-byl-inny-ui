"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { commentFormSchema } from "@/lib/validation/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
type CommentFormProps = {
  postDocumentId: string;
};

export const CommentsForm = ({ postDocumentId }: CommentFormProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [token, setToken] = useState("");

  const isSubmitting = status === "sending";
  const isButtonDisabled = isSubmitting || !isFormValid;

  const buildPayloadFromForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    return {
      postDocumentId,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      comment: String(formData.get("comment") ?? ""),
      hp: String(formData.get("hp") ?? ""),
    };
  };

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);
    setIsFormValid(commentFormSchema.safeParse(payload).success);
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = buildPayloadFromForm(form);

    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, token }),
    });

    const data = await response.json();

    if (!response.ok || data?.ok === false) {
      setStatus("error");
      setMessage(String(data?.error ?? "Coś poszło nie tak."));
      return;
    }

    setStatus("success");
    setMessage(
      String(data?.message ?? "Sprawdź skrzynkę e-mail i potwierdź komentarz."),
    );
    form.reset();
    setIsFormValid(false);
    router.refresh();
  };

  return (
    <div>
      <h3 className="font-dm-sans font-bold text-xl">Zostaw swój komentarz</h3>
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
        />
        <label className="mt-6 block">
          <span className="sr-only">Komentarz</span>
          <textarea
            name="comment"
            required
            placeholder="Napisz swój komentarz..."
            disabled={isSubmitting}
            className="h-48 w-full resize-none border border-neutral-200 bg-white px-5 py-4 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
        </label>

        <div className="flex flex-col gap-4 mt-4 items-end">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            onSuccess={setToken}
            options={{ theme: "light" }}
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {isSubmitting ? "Wysyłanie..." : "Wyślij"}
          </button>
          <div className="mt-4 min-h-[20px]">
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
                {isSubmitting ? "Wysyłanie..." : message}
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

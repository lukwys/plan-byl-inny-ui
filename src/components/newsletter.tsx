"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { newsletterAction } from "@/actions/newsletter-action";
import { newsletterSchema } from "@/lib/validation/schemas";
import { TURNSTILE_SITE_KEY } from "@/config/turnstile";
import Link from "next/link";

type NewsletterProps = {
  heading?: string;
  description?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_FAILED: "Podaj poprawny adres e-mail.",
  TURNSTILE_REQUIRED:
    "Poczekaj chwilę na zakończenie weryfikacji i spróbuj ponownie.",
  TURNSTILE_INVALID: "Weryfikacja nie powiodła się. Spróbuj jeszcze raz.",
};

const FALLBACK_ERROR_MESSAGE =
  "Coś poszło nie tak. Spróbuj ponownie za chwilę.";

export const Newsletter = ({
  heading = "Gdzie jesteśmy?",
  description = "Zostaw maila, a dam Ci znać, gdy pojawi się nowa historia o tym, jak życie zweryfikowało moje plany. Jeden mail na wpis, nic poza tym — wypisujesz się jednym kliknięciem.",
}: NewsletterProps) => {
  const [token, setToken] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerificationStarted, setIsVerificationStarted] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [state, action, isPending] = useActionState(newsletterAction, {
    success: false,
  });

  useEffect(() => {
    const tokenWasSpent =
      !!state.error && state.error !== "VALIDATION_FAILED";

    if (tokenWasSpent) {
      setToken("");
      turnstileRef.current?.reset();
    }
  }, [state]);

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    setIsFormValid(newsletterSchema.safeParse(payload).success);
  };

  const isButtonDisabled = isPending || !isFormValid || !token;
  const isAwaitingVerification = isFormValid && !token && !isPending;

  if (state.success) {
    return (
      <div className="text-center px-2" role="status">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
          className="mx-auto mb-4 h-12 w-12 text-emerald-700"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.5 2.5 2.5 5.5-5.5" strokeLinecap="round" />
        </svg>
        <h3 className="font-dm-sans font-semibold text-xl mb-3">
          {state.alreadySubscribed ? "Już jesteś na liście" : "Sprawdź skrzynkę"}
        </h3>
        <p className="font-eb-garamond">{state.message}</p>
        {!state.alreadySubscribed && (
          <p className="mt-3 text-xs text-gray-500 font-light">
            Nie widzisz maila? Zajrzyj do folderu ze spamem — czasem tam ląduje.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center px-2">
      <h3 className="font-dm-sans font-semibold text-xl mb-4">{heading}</h3>
      <p className="font-eb-garamond mb-4">{description}</p>
      <form
        action={action}
        onInput={handleFormInput}
        onFocus={() => setIsVerificationStarted(true)}
      >
        <label className="block">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail*"
            disabled={isPending}
            className="h-12 w-full border border-neutral-200 bg-white px-5 mb-2 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
          {state.errors?.fieldErrors.email && (
            <p className="text-red-700 text-xs mb-3 text-left">
              {state.errors.fieldErrors.email}
            </p>
          )}
        </label>
        <input
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        {isVerificationStarted && (
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY ?? ""}
              onSuccess={setToken}
              onExpire={() => setToken("")}
              onError={() => setToken("")}
              options={{ theme: "light", size: "flexible" }}
            />
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Zapisywanie..." : "Wchodzę w to!"}
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500 font-light">
          Zapisując się do newslettera, akceptujesz naszą{" "}
          <Link
            href="/polityka-prywatnosci"
            className="underline hover:text-main-red transition-colors"
          >
            Politykę prywatności
          </Link>
          . Twoje dane są u nas bezpieczne.
        </p>
        <div className="mt-3 min-h-[20px]">
          {isAwaitingVerification && (
            <p className="text-sm text-gray-500" role="status">
              Trwa weryfikacja antyspamowa...
            </p>
          )}
          {state.error && (
            <p className="text-sm text-red-700" role="status">
              {ERROR_MESSAGES[state.error] ?? FALLBACK_ERROR_MESSAGE}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

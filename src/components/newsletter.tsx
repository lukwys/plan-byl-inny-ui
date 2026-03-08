"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { newsletterAction } from "@/actions/newsletter-action";
import { newsletterSchema } from "@/lib/validation/schemas";
import { TURNSTILE_SITE_KEY } from "@/config/turnstile";

export const Newsletter = () => {
  const [token, setToken] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action, isPending] = useActionState(newsletterAction, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setToken("");
      setIsFormValid(false);
    }
  }, [state.success]);

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    setIsFormValid(newsletterSchema.safeParse(payload).success);
  };

  const isButtonDisabled = isPending || !isFormValid || !token;

  return (
    <div className="text-center">
      <h3 className="font-dm-sans font-semibold text-xl mb-4">
        Gdzie jesteśmy?
      </h3>
      <p className="font-eb-garamond mb-4">
        Zostaw maila, a dam Ci znać, gdy pojawi się nowa historia o tym, jak
        życie zweryfikowało moje plany.
      </p>
      <form ref={formRef} action={action} onInput={handleFormInput}>
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
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY ?? ""}
          onSuccess={setToken}
          options={{ theme: "light" }}
        />
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {isPending ? "Zapisywanie..." : "Wchodzę w to!"}
          </button>
        </div>
        <div className="mt-3 min-h-[20px]">
          {(state.message || state.error) && (
            <p
              className={`text-sm ${state.success ? "text-green-700" : "text-red-700"}`}
              role="status"
            >
              {state.success
                ? state.message
                : state.error === "VALIDATION_FAILED"
                  ? "Błędny e-mail"
                  : state.error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

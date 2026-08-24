"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { contactAction } from "@/actions/contact-action";
import { contactFormSchema } from "@/lib/validation/schemas";
import { useTurnstile } from "@/lib/forms/use-turnstile";
import { formErrorMessage } from "@/lib/forms/error-messages";
import { Honeypot } from "./forms/honeypot";

export const ContactForm = () => {
  const [state, action, isPending] = useActionState(contactAction, {
    success: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { token, isMounted, formProps, turnstileProps } = useTurnstile(state);

  const handleFormInput = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    setIsFormValid(contactFormSchema.safeParse(payload).success);
  };

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormValid(false);
    }
  }, [state.success]);

  const isButtonDisabled = isPending || !isFormValid || !token;

  return (
    <form
      ref={formRef}
      action={action}
      onInput={handleFormInput}
      {...formProps}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="sr-only">Imię</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Imię*"
            disabled={isPending}
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
          {state.errors?.fieldErrors.name && (
            <p className="mt-1 text-xs text-red-600">
              {state.errors?.fieldErrors.name}
            </p>
          )}
        </label>
        <label className="block">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail*"
            disabled={isPending}
            className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
          />
          {state.errors?.fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">
              {state.errors?.fieldErrors.email}
            </p>
          )}
        </label>
      </div>
      <Honeypot />
      <label className="mt-6 block">
        <span className="sr-only">Wiadomość</span>
        <textarea
          name="content"
          required
          placeholder="Wiadomość..."
          disabled={isPending}
          className="h-48 w-full resize-none border border-neutral-200 bg-white px-5 py-4 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
        />
        {state.errors?.fieldErrors.content && (
          <p className="mt-1 text-xs text-red-600">
            {state.errors?.fieldErrors.content}
          </p>
        )}
      </label>
      <div className="flex flex-col gap-4 mt-4 items-center">
        {isMounted && (
          <Turnstile {...turnstileProps} options={{ theme: "light" }} />
        )}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="h-12 w-64 bg-black text-base font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          {isPending ? "Wysyłanie..." : "Wyślij"}
        </button>
        {(state.message || state.error) && (
          <p
            className={`text-sm ${state.success ? "text-green-700" : "text-red-700"}`}
            role="status"
            aria-live="polite"
          >
            {state.success ? state.message : formErrorMessage(state.error)}
          </p>
        )}
      </div>
    </form>
  );
};

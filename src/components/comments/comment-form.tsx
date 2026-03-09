"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { commentAction } from "@/actions/comment-action";
import { commentFormSchema } from "@/lib/validation/schemas";

interface CommentFormProps {
  postDocumentId: string;
  postTitle: string;
}

export const CommentForm = ({
  postDocumentId,
  postTitle,
}: CommentFormProps) => {
  const [token, setToken] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, action, isPending] = useActionState(commentAction, {
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
    setIsFormValid(commentFormSchema.safeParse(payload).success);
  };

  const isButtonDisabled = isPending || !isFormValid || !token;

  return (
    <div>
      <h3 className="font-dm-sans font-bold text-xl mb-10">
        Zostaw swój komentarz
      </h3>
      <form ref={formRef} action={action} onInput={handleFormInput}>
        <input type="hidden" name="postDocumentId" value={postDocumentId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="sr-only">Twoje imię</span>
            <input
              type="text"
              name="name"
              required
              placeholder="Imię*"
              disabled={isPending}
              className="h-12 w-full border border-neutral-200 bg-white px-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60"
            />
            {state.errors?.fieldErrors.name && (
              <p className="text-red-700 text-xs mt-1 text-left">
                {state.errors.fieldErrors.name}
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
              <p className="text-red-700 text-xs mt-1 text-left">
                {state.errors.fieldErrors.email}
              </p>
            )}
          </label>
        </div>
        <label className="block mb-4">
          <span className="sr-only">Komentarz</span>
          <textarea
            name="comment"
            required
            rows={5}
            placeholder="Komentarz* (min. 5 znaków)"
            disabled={isPending}
            className="w-full border border-neutral-200 bg-white p-5 text-sm placeholder:italic placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-60 resize-none"
          />
          {state.errors?.fieldErrors.comment && (
            <p className="text-red-700 text-xs mt-1 text-left">
              {state.errors.fieldErrors.comment}
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
        <input type="hidden" name="postTitle" value={postTitle} />
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
            {isPending ? "Wysyłanie..." : "Dodaj komentarz"}
          </button>
        </div>
        <div className="mt-3 min-h-[20px]">
          {(state.message || (state.error && !state.errors)) && (
            <p
              className={`text-sm ${state.success ? "text-green-700" : "text-red-700"}`}
              role="status"
            >
              {state.success
                ? state.message
                : "Coś poszło nie tak. Spróbuj ponownie."}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

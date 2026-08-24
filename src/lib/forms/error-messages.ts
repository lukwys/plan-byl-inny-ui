const MESSAGES: Record<string, string> = {
  VALIDATION_FAILED: "Popraw zaznaczone pola i spróbuj ponownie.",
  TURNSTILE_REQUIRED:
    "Poczekaj chwilę na zakończenie weryfikacji i spróbuj ponownie.",
  TURNSTILE_INVALID: "Weryfikacja nie powiodła się. Spróbuj jeszcze raz.",
};

const FALLBACK = "Coś poszło nie tak. Spróbuj ponownie za chwilę.";

export const formErrorMessage = (code?: string) => MESSAGES[code ?? ""] ?? FALLBACK;

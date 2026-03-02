import { TurnstileVerifyResult } from "@/types/turnstile";

export const validateTurnstile = async (token: string) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return {
      success: false,
      "error-codes": ["missing-input-secret"],
    } as TurnstileVerifyResult;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData },
    );

    if (!response.ok) {
      return {
        success: false,
        "error-codes": ["siteverify-http-error"],
      } as TurnstileVerifyResult;
    }

    const result = (await response.json()) as TurnstileVerifyResult;

    return result;
  } catch (error) {
    console.error("Turnstile validation error:", error);
    return {
      success: false,
      "error-codes": ["internal-error"],
    } as TurnstileVerifyResult;
  }
};

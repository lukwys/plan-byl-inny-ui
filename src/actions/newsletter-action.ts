"use server";

import { z } from "zod";
import { Resend } from "resend";
import {
  NewsletterFormData,
  newsletterSchema,
  ZodErrors,
} from "@/lib/validation/schemas";
import { validateTurnstile } from "@/lib/validation/validate-turnstile";
import { createToken, sha256 } from "@/lib/security/tokens";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/config/strapi";
import { COMMENTS_FROM_EMAIL, RESEND_API_KEY } from "@/config/resend";
import { SITE_URL } from "@/config/next";

const resend = new Resend(RESEND_API_KEY);

export type NewsletterState = {
  success: boolean;
  error?: string;
  errors?: ZodErrors<NewsletterFormData>;
  message?: string;
};

export async function newsletterAction(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = newsletterSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "VALIDATION_FAILED",
      errors: z.flattenError(validatedFields.error),
    };
  }

  const { email, hp } = validatedFields.data;

  if (hp) return { success: true, message: "OK" };

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  if (!turnstileToken) return { success: false, error: "TURNSTILE_REQUIRED" };

  const validation = await validateTurnstile(turnstileToken);
  if (!validation.success)
    return { success: false, error: "TURNSTILE_INVALID" };

  if (!STRAPI_URL || !STRAPI_API_TOKEN || !RESEND_API_KEY) {
    return { success: false, error: "SERVER_MISCONFIG" };
  }

  try {
    const token = createToken();
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const strapiRes = await fetch(
      `${STRAPI_URL}/api/newsletter-verifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: { email, tokenHash, expiresAt, usedAt: null },
        }),
        cache: "no-store",
      },
    );

    if (!strapiRes.ok) {
      const errText = await strapiRes.text().catch(() => "");
      return {
        success: false,
        error: "STRAPI_CREATE_FAILED",
        message: errText.slice(0, 100),
      };
    }

    const confirmUrl = `${SITE_URL}/api/newsletter/verify?token=${token}`;

    const { error: mailError } = await resend.emails.send({
      from: `Plan był inny <${COMMENTS_FROM_EMAIL}>`,
      to: email,
      subject: "Potwierdź swój zapis do newslettera",
      text: `Cześć!\n\nDziękuję za chęć dołączenia do newslettera. Kliknij w poniższy link, aby potwierdzić swój adres e-mail:\n\n${confirmUrl}\n\nLink jest ważny przez 24 godziny.\n\nJeśli to nie Ty, zignoruj tę wiadomość.\n`,
    });

    if (mailError) throw new Error(mailError.message);

    return {
      success: true,
      message: "Sprawdź skrzynkę e-mail i potwierdź subskrypcję.",
    };
  } catch (err) {
    console.error("Newsletter error:", err);
    return { success: false, error: "SUBSCRIBE_FAILED" };
  }
}

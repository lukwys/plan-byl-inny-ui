"use server";

import { z } from "zod";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation/schemas";
import { validateTurnstile } from "@/lib/validation/validate-turnstile";
import { RESEND_AUDIENCE_ID, RESEND_CONTACTS_API_KEY } from "@/config/resend";

const resend = new Resend(RESEND_CONTACTS_API_KEY);

export type NewsletterState = {
  success: boolean;
  error?: string;
  errors?: Record<string, any>;
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
      errors: z.treeifyError(validatedFields.error) as Record<string, any>,
    };
  }

  const { email, hp } = validatedFields.data;

  if (hp) return { success: true, message: "OK" };

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!token) return { success: false, error: "TURNSTILE_REQUIRED" };

  const validation = await validateTurnstile(token);
  if (!validation.success)
    return { success: false, error: "TURNSTILE_INVALID" };

  if (!RESEND_CONTACTS_API_KEY || !RESEND_AUDIENCE_ID) {
    console.error("Newsletter config missing");
    return { success: false, error: "SERVER_ERROR" };
  }

  try {
    const { data: existingContact } = await resend.contacts.get({
      email,
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (existingContact) {
      return {
        success: true,
        message: "Plan był inny, ale Ty już z nami jesteś!",
      };
    }

    const { error } = await resend.contacts.create({
      email,
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (error) throw new Error(error.message);

    return { success: true, message: "Super! Dopisałem Cię do listy." };
  } catch (err) {
    console.error("Newsletter error:", err);
    return { success: false, error: "SUBSCRIBE_FAILED" };
  }
}

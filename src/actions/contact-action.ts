"use server";

import { Resend } from "resend";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validation/schemas";
import { validateTurnstile } from "@/lib/validation/validate-turnstile";
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } from "@/config/resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactState = {
  success: boolean;
  error?: string;
  errors?: Record<string, any>;
  message?: string;
};

export async function contactAction(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = contactFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const treeErrors = z.treeifyError(validatedFields.error);

    return {
      success: false,
      error: "VALIDATION_FAILED",
      errors: treeErrors as Record<string, any>,
    };
  }

  const { name, email, content, hp } = validatedFields.data;

  if (hp) {
    console.log("Honeypot triggered");
    return { success: true, message: "Dzięki za wiadomość!" };
  }

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (!token) return { success: false, error: "TURNSTILE_REQUIRED" };

  const validation = await validateTurnstile(token);
  if (!validation.success)
    return { success: false, error: "TURNSTILE_INVALID" };

  if (!process.env.RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("Missing ENV configuration");
    return { success: false, error: "SERVER_ERROR" };
  }

  try {
    const { error } = await resend.emails.send({
      from: `Plan był inny <${CONTACT_FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      subject: `Kontakt: ${name}`,
      replyTo: email,
      text: `Od: ${name} <${email}>\n\n${content}`,
    });

    if (error) throw new Error(error.message);

    return { success: true, message: "Wiadomość wysłana!" };
  } catch (err) {
    console.error("Resend error:", err);
    return { success: false, error: "SEND_FAILED" };
  }
}

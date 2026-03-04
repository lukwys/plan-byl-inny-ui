"use server";

import { z } from "zod";
import { Resend } from "resend";
import {
  CommentFormData,
  commentFormSchema,
  ZodErrors,
} from "@/lib/validation/schemas";
import { validateTurnstile } from "@/lib/validation/validate-turnstile";
import { createToken, sha256 } from "@/lib/security/tokens";
import { CONTACT_FROM_EMAIL, RESEND_API_KEY } from "@/config/resend";
import { STRAPI_API_TOKEN, STRAPI_URL } from "@/config/strapi";
import { SITE_URL } from "@/config/next";

const resend = new Resend(RESEND_API_KEY);

export type CommentState = {
  success: boolean;
  error?: string;
  errors?: ZodErrors<CommentFormData>;
  message?: string;
};

export async function commentAction(
  _prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = commentFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "VALIDATION_FAILED",
      errors: z.flattenError(validatedFields.error),
    };
  }

  const { postDocumentId, name, email, comment, hp } = validatedFields.data;

  if (hp) return { success: true, message: "Dziękujemy za komentarz!" };

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  if (!turnstileToken) return { success: false, error: "TURNSTILE_REQUIRED" };

  const validation = await validateTurnstile(turnstileToken);

  if (!validation.success)
    return { success: false, error: "TURNSTILE_INVALID" };

  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    console.error("Strapi config missing");
    return { success: false, error: "SERVER_ERROR" };
  }

  try {
    const commentRes = await fetch(`${STRAPI_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          post: postDocumentId,
          authorName: name,
          email,
          body: comment,
          commentStatus: "pending_email",
        },
      }),
    });

    if (!commentRes.ok) throw new Error("STRAPI_COMMENT_FAILED");

    const commentJson = await commentRes.json();
    const commentDocId = commentJson.data.documentId;

    const verificationToken = createToken();
    const tokenHash = sha256(verificationToken);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const verifyRes = await fetch(`${STRAPI_URL}/api/comments-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          tokenHash,
          expiresAt,
          comment: commentDocId,
        },
      }),
    });

    if (!verifyRes.ok) throw new Error("STRAPI_VERIFY_FAILED");

    const siteUrl = SITE_URL;
    const verifyUrl = `${siteUrl}/api/comments/verify?token=${verificationToken}`;

    const { error: mailError } = await resend.emails.send({
      from: `Plan był inny <${CONTACT_FROM_EMAIL}>`,
      to: email,
      subject: "Potwierdź swój komentarz",
      text: `Cześć ${name}!\n\nKliknij w link, aby zatwierdzić komentarz:\n${verifyUrl}\n\nLink wygaśnie za 30 minut.`,
    });

    if (mailError) throw new Error("EMAIL_SEND_FAILED");

    return {
      success: true,
      message: "Sprawdź maila, aby potwierdzić komentarz!",
    };
  } catch (err) {
    console.error("Comment Action Error:", err);
    return { success: false, error: "ACTION_FAILED" };
  }
}

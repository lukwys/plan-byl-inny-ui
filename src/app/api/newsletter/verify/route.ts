import { NextResponse } from "next/server";
import { sha256 } from "@/lib/security/tokens";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/config/strapi";
import { RESEND_AUDIENCE_ID, RESEND_CONTACTS_API_KEY } from "@/config/resend";
import { Resend } from "resend";
import { SITE_URL } from "@/config/next";

const resend = new Resend(RESEND_CONTACTS_API_KEY);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect(`${SITE_URL}/?newsletter=error`);

  const tokenHash = sha256(token);

  try {
    const findRes = await fetch(
      `${STRAPI_URL}/api/newsletter-verifications?filters[tokenHash][$eq]=${tokenHash}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        cache: "no-store",
      },
    );

    const { data } = await findRes.json();
    const verification = data?.[0];

    if (
      !verification ||
      verification.usedAt ||
      (verification.expiresAt &&
        Date.parse(verification.expiresAt) < Date.now())
    ) {
      return NextResponse.redirect(`${SITE_URL}/?newsletter=expired`);
    }

    const { error: resendError } = await resend.contacts.create({
      email: verification.email,
      audienceId: RESEND_AUDIENCE_ID!,
    });

    if (resendError && !resendError.message.includes("already exists")) {
      throw new Error(resendError.message);
    }

    await fetch(
      `${STRAPI_URL}/api/newsletter-verifications/${verification.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: { usedAt: new Date().toISOString() },
        }),
      },
    );

    return NextResponse.redirect(`${SITE_URL}/?newsletter=confirmed`);
  } catch (err) {
    console.error("Newsletter confirmation error:", err);
    return NextResponse.redirect(`${SITE_URL}/?newsletter=error`);
  }
}

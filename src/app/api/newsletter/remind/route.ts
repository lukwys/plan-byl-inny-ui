import { NextResponse } from "next/server";
import { Resend } from "resend";
import qs from "qs";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/config/strapi";
import { COMMENTS_FROM_EMAIL, RESEND_API_KEY } from "@/config/resend";
import { SITE_URL } from "@/config/next";
import { createToken, sha256 } from "@/lib/security/tokens";
import { NewsletterConfirm } from "@/components/emails/newsletter-confirm";

const resend = new Resend(RESEND_API_KEY);

const HOUR = 60 * 60 * 1000;
const MIN_AGE = 6 * HOUR;
const MAX_AGE = 7 * 24 * HOUR;
const TOKEN_LIFETIME = 24 * HOUR;
const BATCH_SIZE = 50;

type Verification = {
  documentId: string;
  email: string;
};

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!STRAPI_URL || !STRAPI_API_TOKEN || !RESEND_API_KEY) {
    return NextResponse.json({ error: "SERVER_MISCONFIG" }, { status: 500 });
  }

  const now = Date.now();

  const query = qs.stringify(
    {
      filters: {
        usedAt: { $null: true },
        remindedAt: { $null: true },
        createdAt: {
          $lt: new Date(now - MIN_AGE).toISOString(),
          $gt: new Date(now - MAX_AGE).toISOString(),
        },
      },
      sort: ["createdAt:asc"],
      pagination: { pageSize: BATCH_SIZE },
      fields: ["email"],
    },
    { encodeValuesOnly: true },
  );

  const listRes = await fetch(
    `${STRAPI_URL}/api/newsletter-verifications?${query}`,
    {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: "no-store",
    },
  );

  if (!listRes.ok) {
    return NextResponse.json(
      { error: "Failed to list pending signups" },
      { status: 502 },
    );
  }

  const { data } = await listRes.json();
  const pending: Verification[] = data ?? [];

  let reminded = 0;

  for (const verification of pending) {
    const token = createToken();

    const updateRes = await fetch(
      `${STRAPI_URL}/api/newsletter-verifications/${verification.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            tokenHash: sha256(token),
            expiresAt: new Date(now + TOKEN_LIFETIME).toISOString(),
            remindedAt: new Date(now).toISOString(),
          },
        }),
        cache: "no-store",
      },
    );

    if (!updateRes.ok) {
      console.error("Reminder skipped, could not refresh token:", verification.email);
      continue;
    }

    const { error } = await resend.emails.send({
      from: `Plan był inny <${COMMENTS_FROM_EMAIL}>`,
      to: verification.email,
      subject: "Twój zapis czeka na potwierdzenie",
      react: NewsletterConfirm({
        confirmUrl: `${SITE_URL}/api/newsletter/verify?token=${token}`,
        isReminder: true,
      }),
    });

    if (error) {
      console.error("Reminder send failed:", verification.email, error.message);
      continue;
    }

    reminded += 1;
  }

  return NextResponse.json({ ok: true, pending: pending.length, reminded });
}

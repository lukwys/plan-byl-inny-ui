import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );

  const postDocumentId = String(body.postDocumentId);
  const authorName = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const commentBody = String(body.comment ?? "").trim();
  const website = String(body.website ?? "").trim(); // honeypot

  // honeypot: silent drop
  if (website) return NextResponse.json({ ok: true });

  if (!postDocumentId) {
    return NextResponse.json(
      { ok: false, error: "INVALID_POST" },
      { status: 400 },
    );
  }

  if (authorName.length < 2)
    return NextResponse.json(
      { ok: false, error: "INVALID_NAME" },
      { status: 400 },
    );

  if (!isValidEmail(email))
    return NextResponse.json(
      { ok: false, error: "INVALID_EMAIL" },
      { status: 400 },
    );

  if (commentBody.length < 5)
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY" },
      { status: 400 },
    );

  const strapiUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !token) {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  const res = await fetch(`${strapiUrl}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        post: postDocumentId,
        authorName,
        email,
        body: commentBody,
        commentStatus: "pending_email",
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        error: "STRAPI_CREATE_FAILED",
        details: errText.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const created = await res.json();

  return NextResponse.json({
    ok: true,
    commentId: created?.data?.id ?? null,
  });
}

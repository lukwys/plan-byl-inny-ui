import { readStringParam } from "@/lib/http/read-string-param";
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const postDocumentId = readStringParam(searchParams.get("post"));

  if (!postDocumentId) {
    return NextResponse.json(
      { ok: false, error: "INVALID_POST" },
      { status: 400 },
    );
  }

  const strapiUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl || !token) {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  const qs = new URLSearchParams();
  qs.set("filters[post][documentId][$eq]", postDocumentId);
  qs.set("filters[commentStatus][$eq]", "published");
  qs.set("sort", "createdAt:desc");
  qs.set("pagination[pageSize]", "100");

  qs.set("fields[0]", "documentId");
  qs.set("fields[1]", "authorName");
  qs.set("fields[2]", "body");
  qs.set("fields[3]", "createdAt");

  const res = await fetch(`${strapiUrl}/api/comments?${qs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        error: "STRAPI_FETCH_FAILED",
        details: errText.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const json = await res.json();

  const comments = (json?.data ?? []).map((item: any) => ({
    id: item.id,
    documentId: item.documentId,
    authorName: item.authorName,
    body: item.body,
    createdAt: item.createdAt,
  }));

  return NextResponse.json({ ok: true, comments });
}

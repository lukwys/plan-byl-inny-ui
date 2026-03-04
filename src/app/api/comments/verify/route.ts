import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Dodajemy tylko to
import { readStringParam } from "@/lib/http/read-string-param";
import { sha256 } from "@/lib/security/tokens";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/config/strapi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = readStringParam(searchParams.get("token"));
  const tokenHash = sha256(token);
  const qs = new URLSearchParams();

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "MISSING_TOKEN" },
      { status: 400 },
    );
  }

  if (!STRAPI_URL || !STRAPI_API_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  qs.set("filters[tokenHash][$eq]", tokenHash);
  qs.set("pagination[pageSize]", "1");
  qs.set("populate[comment][populate][post]", "true");

  const findRes = await fetch(
    `${STRAPI_URL}/api/comments-verification?${qs.toString()}`,
    {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      cache: "no-store",
    },
  );

  if (!findRes.ok) {
    return NextResponse.json(
      { ok: false, error: "VERIFY_LOOKUP_FAILED" },
      { status: 502 },
    );
  }

  const findJson = await findRes.json();
  const verification = findJson?.data?.[0];

  if (!verification) {
    return NextResponse.json(
      { ok: false, error: "INVALID_TOKEN" },
      { status: 400 },
    );
  }

  const { expiresAt, usedAt } = verification;

  if (usedAt) {
    return NextResponse.json(
      { ok: false, error: "TOKEN_USED" },
      { status: 400 },
    );
  }
  if (!expiresAt || Date.parse(expiresAt) < Date.now()) {
    return NextResponse.json(
      { ok: false, error: "TOKEN_EXPIRED" },
      { status: 400 },
    );
  }

  const commentDocumentId = verification?.comment?.documentId;
  if (!commentDocumentId) {
    return NextResponse.json(
      { ok: false, error: "NO_COMMENT" },
      { status: 400 },
    );
  }

  const updateCommentRes = await fetch(
    `${STRAPI_URL}/api/comments/${commentDocumentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          commentStatus: "published",
          publishedAt: new Date().toISOString(),
        },
      }),
      cache: "no-store",
    },
  );

  if (!updateCommentRes.ok) {
    return NextResponse.json(
      { ok: false, error: "COMMENT_PUBLISH_FAILED" },
      { status: 502 },
    );
  }

  const verificationDocumentId = verification?.documentId;
  await fetch(
    `${STRAPI_URL}/api/comments-verification/${verificationDocumentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: { usedAt: new Date().toISOString() },
      }),
      cache: "no-store",
    },
  ).catch(() => {});

  const postSlug = verification?.comment?.post?.slug;
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  if (postSlug) {
    revalidatePath(`/posts/${postSlug}`);
    return NextResponse.redirect(
      `${siteUrl}/posts/${postSlug}?comment=verified`,
    );
  }

  return NextResponse.redirect(`${siteUrl}/?comment=verified`);
}

import { PublicCommentModel } from "@/types/comments";

export async function getPublishedComments(
  postDocumentId: string,
): Promise<PublicCommentModel[]> {
  const siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    throw new Error("Missing SITE_URL");
  }

  const res = await fetch(
    `${siteUrl}/api/comments?post=${encodeURIComponent(postDocumentId)}`,
    { cache: "no-store" },
  );

  if (!res.ok) return [];

  const data = await res.json().catch(() => ({}));
  return data?.comments ?? [];
}

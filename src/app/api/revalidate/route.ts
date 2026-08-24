import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { STRAPI_API_TOKEN } from "@/config/strapi";

const MODEL_TAGS: Record<string, string[]> = {
  post: ["posts", "categories"],
  category: ["categories", "posts"],
  homepage: ["homepage"],
  link: ["social-links"],
  "about-me": ["about-me"],
};

export async function POST(req: Request) {
  const secret = req.headers.get("x-strapi-webhook-secret");
  if (!secret || secret !== STRAPI_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const model: string = body.model;
  const slug: string | undefined = body.entry?.slug;

  const tags = MODEL_TAGS[model];
  if (!tags) {
    return NextResponse.json({ ok: true });
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  if (model === "post" && slug) {
    revalidateTag(`post-${slug}`, "max");
  }

  return NextResponse.json({ ok: true });
}

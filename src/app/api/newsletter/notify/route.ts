import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import {
  RESEND_API_KEY,
  RESEND_AUDIENCE_ID,
  NEWSLETTER_FROM_EMAIL,
  STRAPI_WEBHOOK_SECRET,
} from "@/config/resend";
import { strapiService } from "@/services/strapi";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import { NewPost } from "@/components/emails/new-post";

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: Request) {
  const secret = req.headers.get("x-strapi-webhook-secret");
  if (!secret || secret !== STRAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.event !== "entry.publish" || body.model !== "post") {
    return NextResponse.json({ ok: true });
  }

  const slug = body.entry?.slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const post = await strapiService.getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const html = await render(
    NewPost({
      title: post.title,
      preview: post.preview,
      slug: post.slug,
      coverImageUrl: getStrapiImage(post.cover_image.url),
    }),
  );

  const { data, error } = await resend.broadcasts.create({
    audienceId: RESEND_AUDIENCE_ID!,
    from: NEWSLETTER_FROM_EMAIL!,
    subject: `Nowy wpis: ${post.title}`,
    html,
  });

  if (error) {
    console.error("Failed to create broadcast:", error);
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }

  const { error: sendError } = await resend.broadcasts.send(data!.id);

  if (sendError) {
    console.error("Failed to send broadcast:", sendError);
    return NextResponse.json({ error: "Failed to send broadcast" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

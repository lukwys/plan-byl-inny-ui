import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (!url || !url.startsWith("/")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(url);
}

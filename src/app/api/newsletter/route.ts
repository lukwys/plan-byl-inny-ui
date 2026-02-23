import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues?.[0]?.message ?? "INVALID_INPUT",
      },
      { status: 400 },
    );
  }

  // honeypot: silent success
  if (parsed.data.hp) {
    return NextResponse.json({ ok: true, message: "OK" });
  }

  const apiKey = process.env.RESEND_CONTACTS_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const { data } = await resend.contacts.get({ email: parsed.data.email });

  if (data === null) {
    const { error } = await resend.contacts.create({
      email: parsed.data.email,
      audienceId,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "RESEND_SUBSCRIBE_FAILED",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Super! Dopisałem Cię do listy.",
    });
  } else {
    return NextResponse.json({
      ok: true,
      message: "Plan był inny, ale Ty już z nami jesteś!",
    });
  }
}

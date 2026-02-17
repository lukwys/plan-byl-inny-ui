import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isValidEmail } from "@/lib/validation/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const content = String(body.content ?? "").trim();
  const website = String(body.website ?? "").trim(); // honeypot

  if (website) return NextResponse.json({ ok: true }); // silent drop

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "INVALID_NAME" },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_EMAIL" },
      { status: 400 },
    );
  }
  if (content.length < 5) {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!process.env.RESEND_API_KEY || !to || !from) {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  const { data, error } = await resend.emails.send({
    from: `Plan był inny <${from}>`,
    to,
    subject: `Kontakt: ${name}`,
    replyTo: email,
    text: `Od: ${name} <${email}>\n\n${content}`,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "EMAIL_SEND_FAILED", details: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Dzięki! Wiadomość wysłana.",
    id: data?.id,
  });
}

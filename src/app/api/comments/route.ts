import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Brak danych." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const comment = String(body.comment ?? "").trim();
  const website = String(body.website ?? "").trim(); // honeypot

  // honeypot: silent drop
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2) {
    return NextResponse.json(
      { error: "Podaj imię (min. 2 znaki)." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Podaj poprawny e-mail." },
      { status: 400 },
    );
  }

  if (comment.length < 5) {
    return NextResponse.json(
      { error: "Komentarz jest za krótki." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}

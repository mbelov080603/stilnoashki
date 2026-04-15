import { NextResponse } from "next/server";

type LeadPayload = {
  type?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  comment?: string;
  consent?: boolean;
  pageUrl?: string;
  vacancyTitle?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LeadPayload;

  if (!payload.name || !payload.phone || !payload.email || !payload.city || !payload.comment) {
    return NextResponse.json(
      { ok: false, message: "Missing required lead fields." },
      { status: 400 },
    );
  }

  if (!payload.consent) {
    return NextResponse.json(
      { ok: false, message: "Consent is required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    type: payload.type ?? "retail",
    pageUrl: payload.pageUrl ?? "/",
    vacancyTitle: payload.vacancyTitle ?? null,
  });
}


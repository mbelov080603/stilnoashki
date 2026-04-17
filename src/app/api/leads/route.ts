import { mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

type LeadPayload = {
  type?: string;
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  comment?: string;
  website?: string;
  startedAt?: number;
  consent?: boolean;
  pageUrl?: string;
  vacancyTitle?: string;
};

const MIN_SUBMIT_DELAY_MS = 1500;
const LEAD_TYPES = new Set(["retail", "franchise", "partner", "career"]);

function normalizeField(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/[^\d]/g, "").length >= 10;
}

async function appendLeadToLocalStorage(lead: Record<string, unknown>) {
  const leadsDir = join(process.env.TMPDIR || "/tmp", "stilno-leads");
  await mkdir(leadsDir, { recursive: true });
  await appendFile(join(leadsDir, "incoming.ndjson"), `${JSON.stringify(lead)}\n`, "utf8");
  return true;
}

async function sendLeadToWebhook(lead: Record<string, unknown>) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Webhook endpoint rejected the lead.");
  }

  return true;
}

async function sendLeadByEmail(lead: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const notifyEmail = process.env.LEADS_NOTIFY_EMAIL?.trim();
  const fromEmail =
    process.env.LEADS_FROM_EMAIL?.trim() ?? "STILNO Leads <no-reply@stilno-site.local>";

  if (!apiKey || !notifyEmail) {
    return false;
  }

  const lines = Object.entries(lead)
    .filter(([, value]) => value)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${String(value)}</p>`)
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      subject: `STILNO lead: ${String(lead.type ?? "retail")}`,
      html: `<div>${lines}</div>`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Email notification failed.");
  }

  return true;
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Некорректный формат запроса." },
      { status: 400 },
    );
  }

  if (payload.website) {
    return NextResponse.json(
      { ok: true, leadId: crypto.randomUUID(), receivedAt: new Date().toISOString() },
      { status: 200 },
    );
  }

  const type = LEAD_TYPES.has(payload.type ?? "") ? payload.type! : "retail";
  const name = normalizeField(payload.name);
  const phone = normalizeField(payload.phone);
  const email = normalizeField(payload.email);
  const city = normalizeField(payload.city);
  const comment = normalizeField(payload.comment);
  const pageUrl = normalizeField(payload.pageUrl) || "/";
  const vacancyTitle = normalizeField(payload.vacancyTitle);
  const startedAt = Number(payload.startedAt ?? 0);

  if (!name || !phone || !email || !city) {
    return NextResponse.json(
      { ok: false, message: "Заполните имя, телефон, email и город." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Укажите корректный email." },
      { status: 400 },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, message: "Укажите корректный телефон." },
      { status: 400 },
    );
  }

  if (startedAt && Date.now() - startedAt < MIN_SUBMIT_DELAY_MS) {
    return NextResponse.json(
      { ok: false, message: "Пожалуйста, отправьте форму ещё раз." },
      { status: 400 },
    );
  }

  if (!payload.consent) {
    return NextResponse.json(
      { ok: false, message: "Нужно согласие на обработку персональных данных." },
      { status: 400 },
    );
  }

  const lead = {
    leadId: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    type,
    name,
    phone,
    email,
    city,
    comment,
    pageUrl,
    vacancyTitle: vacancyTitle || null,
  };

  const deliveryResults = await Promise.allSettled([
    appendLeadToLocalStorage(lead),
    sendLeadToWebhook(lead),
    sendLeadByEmail(lead),
  ]);

  const delivered = deliveryResults.some(
    (result) => result.status === "fulfilled" && result.value === true,
  );

  if (!delivered) {
    return NextResponse.json(
      { ok: false, message: "Канал приёма заявок временно недоступен. Повторите попытку позже." },
      { status: 503 },
    );
  }

  console.info("stilno.lead.accepted", lead);

  return NextResponse.json({
    ok: true,
    leadId: lead.leadId,
    receivedAt: lead.receivedAt,
    type: lead.type,
    pageUrl: lead.pageUrl,
    vacancyTitle: lead.vacancyTitle,
  });
}

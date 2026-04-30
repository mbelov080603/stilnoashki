import { NextResponse } from "next/server";

type LeadPayload = {
  type?: string;
  pageUrl?: string;
  website?: string;
  startedAt?: number;
  fields?: Record<string, string>;
  consents?: Record<string, boolean>;
};

const MIN_SUBMIT_DELAY_MS = 1500;
const LEAD_TYPES = new Set(["retail", "franchise", "partner", "career"]);
const RETAIL_REQUEST_TYPES = new Set(["availability", "retail-point", "other-retail"]);
const PARTNER_REQUEST_TYPES = new Set(["wholesale", "existing-retail-point"]);
const FRANCHISE_INTEREST_FORMATS = new Set([
  "brand-launch",
  "existing-point-brand-launch",
  "regional-brand-launch",
]);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 6;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function normalizeField(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/[^\d]/g, "").length >= 10;
}

function escapeHtml(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
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
    .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(typeof value === "string" ? value : JSON.stringify(value))}</p>`)
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

function validateLead(type: string, fields: Record<string, string>, consents: Record<string, boolean>) {
  const name = normalizeField(fields.name);
  const phone = normalizeField(fields.phone);
  const email = normalizeField(fields.email);
  const city = normalizeField(fields.city);
  const requestType = normalizeField(fields.requestType);
  const interestFormat = normalizeField(fields.interestFormat);

  if (!consents.personalData) {
    return "Нужно согласие на обработку персональных данных.";
  }

  if ((type === "retail" || type === "partner" || type === "franchise") && !consents.ageConfirmed) {
    return "Нужно подтвердить возраст 18+.";
  }

  if (!name) {
    return "Укажите имя.";
  }

  if (!city) {
    return "Укажите город или регион.";
  }

  if (type === "retail") {
    if (!phone && !email) {
      return "Укажите телефон или email.";
    }
    if (!requestType) {
      return "Выберите тип розничного запроса.";
    }
    if (!RETAIL_REQUEST_TYPES.has(requestType)) {
      return "Неизвестный тип розничного запроса.";
    }
  }

  if (type === "partner") {
    if (!phone || !email) {
      return "Укажите телефон и email.";
    }
    if (!requestType) {
      return "Выберите направление B2B-запроса.";
    }
    if (!PARTNER_REQUEST_TYPES.has(requestType)) {
      return "Неизвестное направление B2B-запроса.";
    }
  }

  if (type === "franchise") {
    if (!phone || !email) {
      return "Укажите телефон и email.";
    }
    if (!interestFormat) {
      return "Выберите формат запуска под брендом.";
    }
    if (!FRANCHISE_INTEREST_FORMATS.has(interestFormat)) {
      return "Неизвестный формат запуска под брендом.";
    }
  }

  if (type === "career") {
    if (!email) {
      return "Укажите email.";
    }
  }

  if (email && !isValidEmail(email)) {
    return "Укажите корректный email.";
  }

  if (phone && !isValidPhone(phone)) {
    return "Укажите корректный телефон.";
  }

  return null;
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { ok: false, message: "Слишком много отправок. Повторите попытку позже." },
      { status: 429 },
    );
  }

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
  const fields = Object.fromEntries(
    Object.entries(payload.fields ?? {}).map(([key, value]) => [key, normalizeField(value)]),
  );
  const consents = Object.fromEntries(
    Object.entries(payload.consents ?? {}).map(([key, value]) => [key, Boolean(value)]),
  );
  const pageUrl = normalizeField(payload.pageUrl) || "/";
  const startedAt = Number(payload.startedAt ?? 0);

  if (startedAt && Date.now() - startedAt < MIN_SUBMIT_DELAY_MS) {
    return NextResponse.json(
      { ok: false, message: "Пожалуйста, отправьте форму ещё раз." },
      { status: 400 },
    );
  }

  const validationError = validateLead(type, fields, consents);
  if (validationError) {
    return NextResponse.json({ ok: false, message: validationError }, { status: 400 });
  }

  const lead = {
    leadId: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    type,
    pageUrl,
    fields,
    consents,
  };

  const hasDurableDelivery =
    Boolean(process.env.LEADS_WEBHOOK_URL?.trim()) ||
    Boolean(process.env.RESEND_API_KEY?.trim() && process.env.LEADS_NOTIFY_EMAIL?.trim());

  if (!hasDurableDelivery) {
    console.error("stilno.lead.delivery_not_configured", {
      leadId: lead.leadId,
      type: lead.type,
      pageUrl: lead.pageUrl,
    });

    return NextResponse.json(
      { ok: false, message: "Канал приёма заявок временно недоступен. Повторите попытку позже." },
      { status: 503 },
    );
  }

  const deliveryResults = await Promise.allSettled([sendLeadToWebhook(lead), sendLeadByEmail(lead)]);

  const delivered = deliveryResults.some(
    (result) => result.status === "fulfilled" && result.value === true,
  );

  if (!delivered) {
    return NextResponse.json(
      { ok: false, message: "Канал приёма заявок временно недоступен. Повторите попытку позже." },
      { status: 503 },
    );
  }

  console.info("stilno.lead.accepted", {
    leadId: lead.leadId,
    type: lead.type,
    pageUrl: lead.pageUrl,
    delivered,
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.leadId,
    receivedAt: lead.receivedAt,
    type: lead.type,
    pageUrl: lead.pageUrl,
  });
}

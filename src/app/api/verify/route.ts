import { NextResponse } from "next/server";

import { verifyCodeLocally } from "@/lib/verification";

type VerifyPayload = {
  code?: string;
};

export async function POST(request: Request) {
  let payload: VerifyPayload;

  try {
    payload = (await request.json()) as VerifyPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Некорректный формат запроса." },
      { status: 400 },
    );
  }

  const code = payload.code?.trim();

  if (!code) {
    return NextResponse.json(
      { ok: false, message: "Введите код с упаковки." },
      { status: 400 },
    );
  }

  const result = verifyCodeLocally(code);

  return NextResponse.json({
    ok: true,
    checkId: crypto.randomUUID(),
    checkedAt: new Date().toISOString(),
    ...result,
  });
}

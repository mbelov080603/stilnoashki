export type VerificationStatus = "valid" | "already_checked" | "revoked" | "unknown";

export type VerificationRecord = {
  code: string;
  status: Exclude<VerificationStatus, "unknown">;
  batch: string;
  manufacturedAt: string;
  expiresAt: string;
  checks: number;
  firstCheckedAt?: string;
  lastCheckedAt?: string;
  note: string;
};

export type VerificationResult = {
  normalizedCode: string;
  status: VerificationStatus;
  title: string;
  message: string;
  record?: VerificationRecord;
};

const verificationRegistry: VerificationRecord[] = [
  {
    code: "STILNO-CODE-0426",
    status: "valid",
    batch: "ST-0426-A",
    manufacturedAt: "2026-04-01",
    expiresAt: "2030-04-01",
    checks: 0,
    note: "Код есть в локальном реестре STILNO. Упаковка и защитная зона должны совпадать с маркировкой партии.",
  },
  {
    code: "STILNO-MSK-0001",
    status: "valid",
    batch: "ST-0426-MSK",
    manufacturedAt: "2026-04-01",
    expiresAt: "2030-04-01",
    checks: 1,
    firstCheckedAt: "2026-04-29T10:00:00.000Z",
    note: "Код подтверждён. Повторная проверка допустима, если упаковка находится у пользователя.",
  },
  {
    code: "STILNO-USED-0001",
    status: "already_checked",
    batch: "ST-0326-B",
    manufacturedAt: "2026-03-15",
    expiresAt: "2030-03-15",
    checks: 4,
    firstCheckedAt: "2026-04-10T09:15:00.000Z",
    lastCheckedAt: "2026-04-28T18:40:00.000Z",
    note: "Код уже проверяли несколько раз. Сохраните упаковку и обратитесь в поддержку, если проверка была не вашей.",
  },
  {
    code: "STILNO-REVOKED-0001",
    status: "revoked",
    batch: "ST-0226-R",
    manufacturedAt: "2026-02-20",
    expiresAt: "2030-02-20",
    checks: 2,
    firstCheckedAt: "2026-03-01T11:20:00.000Z",
    lastCheckedAt: "2026-03-05T14:30:00.000Z",
    note: "Код отозван из публичной проверки. Не используйте продукт и обратитесь в поддержку STILNO.",
  },
];

const registryByCode = new Map(verificationRegistry.map((record) => [record.code, record]));

export function normalizeVerificationCode(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export function verifyCodeLocally(value: string): VerificationResult {
  const normalizedCode = normalizeVerificationCode(value);

  if (normalizedCode.length < 8 || !/^STILNO-[A-Z0-9-]{4,}$/.test(normalizedCode)) {
    return {
      normalizedCode,
      status: "unknown",
      title: "Код не похож на код STILNO",
      message:
        "Проверьте защитную наклейку или QR-код на упаковке. Если упаковка повреждена, отправьте фото в поддержку.",
    };
  }

  const record = registryByCode.get(normalizedCode);

  if (!record) {
    return {
      normalizedCode,
      status: "unknown",
      title: "Код не найден в реестре",
      message:
        "Не используйте продукт из сомнительного источника. Сохраните упаковку и обратитесь в поддержку STILNO для ручной проверки.",
    };
  }

  if (record.status === "revoked") {
    return {
      normalizedCode,
      status: "revoked",
      title: "Код отозван",
      message: record.note,
      record,
    };
  }

  if (record.status === "already_checked") {
    return {
      normalizedCode,
      status: "already_checked",
      title: "Код уже проверяли",
      message: record.note,
      record,
    };
  }

  return {
    normalizedCode,
    status: "valid",
    title: "Оригинальность подтверждена",
    message: record.note,
    record,
  };
}

import http from "node:http";

import { expect, type Locator, type Page, test } from "@playwright/test";

const publicPaths = [
  "/",
  "/contacts",
  "/about",
  "/brand",
  "/responsible",
  "/partners",
  "/partners/media-kit",
  "/partners/geography",
  "/quality",
  "/request",
  "/franchise",
  "/stores",
  "/stores/map",
  "/stores/moscow",
  "/stores/moscow/stilno-vavilon",
  "/verify",
  "/support",
  "/gallery",
  "/careers",
  "/careers/regional-partner-manager",
  "/careers/trade-marketing-specialist",
  "/articles",
  "/articles/how-to-check-original",
  "/articles/retail-18-rules",
  "/articles/partner-kit-overview",
  "/faq",
  "/legal/privacy",
  "/legal/consent",
  "/legal/cookies",
  "/legal/terms",
  "/legal/not-public-offer",
  "/legal/age-18",
  "/legal/disclaimer",
];

type WebhookLead = {
  leadId?: string;
  type?: string;
  pageUrl?: string;
  fields?: Record<string, string>;
  consents?: Record<string, boolean>;
};

const webhookRequests: WebhookLead[] = [];
let webhookServer: http.Server;

async function seedConsent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("stilno:age-gate", "2.0");
    window.localStorage.setItem(
      "stilno:cookie-consent",
      JSON.stringify({ version: "2.0", necessary: true, ageGate: true, analytics: false }),
    );
  });
}

async function backdateStartedAt(form: Locator) {
  await form.locator('input[name="startedAt"]').evaluate((element) => {
    (element as HTMLInputElement).value = String(Date.now() - 3000);
  });
}

async function setLeadClientKey(page: Page, clientKey: string) {
  await page.route("**/api/leads", async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        "x-forwarded-for": clientKey,
      },
    });
  });
}

test.beforeAll(async () => {
  webhookServer = http.createServer((request, response) => {
    if (request.method !== "POST" || request.url !== "/leads") {
      response.writeHead(404).end();
      return;
    }

    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      webhookRequests.push(JSON.parse(body) as WebhookLead);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ ok: true }));
    });
  });

  await new Promise<void>((resolve) => {
    webhookServer.listen(3011, "127.0.0.1", resolve);
  });
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    if (!webhookServer.listening) {
      resolve();
      return;
    }

    webhookServer.close((error) => (error ? reject(error) : resolve()));
  });
});

for (const path of publicPaths) {
  test(`renders production content without visible placeholders: ${path}`, async ({ page, isMobile }) => {
    await seedConsent(page);
    await page.goto(path);
    await page.waitForTimeout(250);
    if (path === "/") {
      await expect(page.locator('[data-testid="home-hero"]')).toBeVisible();
      await expect(page.locator("main h1")).toContainText("STILNO CLICK ONE");
    } else if (path === "/stores") {
      await expect(page.locator("h1").first()).toContainText("Каталог STILNO");
    } else {
      await expect(page.locator("h1").first()).toBeVisible();
    }
    await expect(page.locator("[data-media-slot]")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Место для|Слот|будет добавлен|будет замен/);
    const metrics = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(metrics.scrollWidth - metrics.innerWidth).toBeLessThanOrEqual(1);
    if (isMobile) {
      expect(metrics.innerWidth).toBeLessThanOrEqual(430);
    }
  });
}

test("age gate and cookie consent can be completed in a fresh session", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Мне есть 18 лет" }).click();
  await expect(page.getByText("Cookie-файлы")).toBeVisible();
  await page.getByRole("button", { name: "Только необходимые" }).click();
  await expect(page.getByText("Cookie-файлы")).toHaveCount(0);
});

test("verify page checks code through verification API", async ({ page }) => {
  await seedConsent(page);
  await page.goto("/verify");
  await page.locator('input[placeholder="STILNO-XXXX-XXXX"]').fill("STILNO-CODE-0426");
  await page.locator("#verify-checker button").click();
  await expect(page.getByText("Оригинальность подтверждена")).toBeVisible();
  await expect(page.getByText("ST-0426-A")).toBeVisible();

  await page.locator('input[placeholder="STILNO-XXXX-XXXX"]').fill("STILNO-UNKNOWN-0000");
  await page.locator("#verify-checker button").click();
  await expect(page.getByText("Код не найден в реестре")).toBeVisible();
});

test("store locator shows the published Moscow point and route controls", async ({ page }) => {
  await seedConsent(page);
  await page.goto("/stores/moscow/stilno-vavilon");
  await expect(page.locator("h1", { hasText: "STILNO" })).toBeVisible();
  await expect(page.getByText("Москва, Бизнес центр Вавилон")).toBeVisible();
  await expect(page.getByText("+7 999 244-28-36")).toBeVisible();
  await expect(page.getByRole("link", { name: "Построить маршрут" })).toHaveAttribute(
    "href",
    /yandex\.ru\/maps/,
  );
  await expect(page.getByRole("link", { name: "Позвонить" })).toHaveAttribute("href", "tel:+79992442836");
});

test("stores map shows the central office point and route controls", async ({ page }) => {
  await seedConsent(page);
  await page.goto("/stores/map");
  await expect(page.locator("h1", { hasText: "Карта магазинов" })).toBeVisible();
  await expect(page.getByText("Ulitsa Vavilova, 69/75, Moscow, 117335")).toBeVisible();
  await expect(page.getByText("+7 999 244-28-36")).toBeVisible();
  await expect(page.getByRole("link", { name: "Построить маршрут" })).toHaveAttribute(
    "href",
    /yandex\.ru\/maps/,
  );
});

test("retail lead is delivered to durable webhook and redirects to thank-you", async ({ page }, testInfo) => {
  webhookRequests.length = 0;
  await setLeadClientKey(page, `retail-${testInfo.project.name}`);
  await seedConsent(page);
  await page.goto("/stores/moscow/stilno-vavilon");
  const form = page.locator("form").filter({ hasText: "Розничный запрос" }).first();
  await backdateStartedAt(form);
  await form.locator('input[name="city"]').fill("Москва");
  await form.locator('input[name="name"]').fill("Тестовый пользователь");
  await form.locator('input[name="phone"]').fill("+7 999 244-28-36");
  await form.locator('select[name="requestType"]').selectOption("availability");
  await form.locator('input[name="ageConfirmed"]').check();
  await form.locator('input[name="personalData"]').check();
  await form.getByRole("button", { name: "Отправить запрос" }).click();
  await expect(page).toHaveURL(/\/thank-you\/retail/);
  await expect.poll(() => webhookRequests.length).toBe(1);
  expect(webhookRequests[0].leadId).toBeTruthy();
  expect(webhookRequests[0].fields?.phone).toBe("+7 999 244-28-36");
});

test("partner lead is delivered to durable webhook and redirects to thank-you", async ({ page }, testInfo) => {
  webhookRequests.length = 0;
  await setLeadClientKey(page, `partner-${testInfo.project.name}`);
  await seedConsent(page);
  await page.goto("/request#request-form");
  const form = page.locator("#partner-form form").first();
  await expect(form.locator('select[name="requestType"] option')).toHaveText([
    "Выберите вариант",
    "Оптовое сотрудничество",
    "Розничная точка",
    "Дистрибуция",
    "Партнёрство",
    "Другое",
  ]);
  await backdateStartedAt(form);
  await form.locator('input[name="name"]').fill("B2B тест");
  await form.locator('input[name="company"]').fill("STILNO smoke");
  await form.locator('input[name="phone"]').fill("+7 999 244-28-36");
  await form.locator('input[name="email"]').fill("partner@example.com");
  await form.locator('input[name="city"]').fill("Москва");
  await form.locator('select[name="requestType"]').selectOption("wholesale");
  await form.locator('input[name="ageConfirmed"]').check();
  await form.locator('input[name="personalData"]').check();
  await form.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page).toHaveURL(/\/thank-you\/partner/);
  await expect.poll(() => webhookRequests.length).toBe(1);
  expect(webhookRequests[0].leadId).toBeTruthy();
  expect(webhookRequests[0].type).toBe("partner");
  expect(webhookRequests[0].pageUrl).toBe("/request");
  expect(webhookRequests[0].fields).toMatchObject({
    name: "B2B тест",
    company: "STILNO smoke",
    phone: "+7 999 244-28-36",
    email: "partner@example.com",
    city: "Москва",
    requestType: "wholesale",
  });
  expect(webhookRequests[0].consents).toMatchObject({
    ageConfirmed: true,
    personalData: true,
  });
});

test("multipage site positioning is visible on key pages", async ({ page }) => {
  await seedConsent(page);

  await page.goto("/");
  await expect(page.locator('[data-testid="home-hero"]')).toBeVisible();
  await expect(page.locator("main")).toContainText("Вы приобретаете стартовый набор");
  await expect(page.locator("main")).toContainText("Устройство с возможностью зарядки : Type-C");
  await expect(page.locator("main")).toContainText("С холодком - 9 вкусов");
  await expect(page.locator("main")).not.toContainText("Официальный сайт STILNO");
  await expect(page.locator("main")).not.toContainText("Выберите нужный раздел");
  await expect(page.locator("main")).not.toContainText("Единственный раздел с подробным каталогом STILNO");
  await expect(page.locator("main form")).toHaveCount(0);

  await page.goto("/brand");
  await expect(page.locator("h1")).toContainText("STILNO — премиальный бренд электронных сигарет");
  await expect(page.locator("main")).toContainText("Бренд без визуального шума");
  await expect(page.locator("main")).toContainText("Каталог не дублируется на брендовой странице");
  await expect(page.locator("main")).toContainText("Подробности разнесены по отдельным страницам");
  await expect(page.locator("form")).toHaveCount(0);

  await page.goto("/partners");
  await expect(page.locator("main")).toContainText("Бренд без визуального шума");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://localhost:3010/brand");

  await page.goto("/about");
  await expect(page.locator("main")).toContainText("Бренд без визуального шума");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://localhost:3010/brand");

  await page.goto("/stores");
  await expect(page.locator("h1")).toContainText("Каталог STILNO");
  await expect(page.locator("main")).toContainText("Картриджи");
  await expect(page.locator("main")).toContainText("Устройство в сборе");
  await expect(page.locator("main")).toContainText("30 вкусов");
  await expect(page.locator("main")).not.toContainText("Текущая точка");
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.locator('[data-testid="catalog-card-cartridges"]')).toBeVisible();
  await expect(page.locator('[data-testid="catalog-card-device-kit"]')).toBeVisible();
  await expect(page.locator('[data-testid^="catalog-flavor-card-"]')).toHaveCount(30);
  await expect(page.locator('[data-testid="catalog-cart"]')).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("Корзина");
  await expect(page.locator("main")).not.toContainText("Добавьте вкус");
  await page.locator('[data-testid="catalog-card-cartridges"]').click();
  await expect(page.locator("main")).toContainText("Витрина вкусов STILNO");
  await expect(page.locator('[data-testid^="catalog-flavor-card-"]')).toHaveCount(30);
  await expect(page.locator('[data-testid="catalog-cart"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="catalog-model-specs"]')).toBeVisible();
  await page.locator('[data-testid="catalog-model-specs"] summary').click();
  await expect(page.locator('[data-testid="catalog-model-specs"]').getByText("STILNO CLICK ONE")).toBeVisible();
  await expect(page.locator('[data-testid="catalog-model-specs"]').getByText("10–22 Вт")).toBeVisible();
  await expect(page.locator('[data-testid="catalog-flavor-card-kaktus-laym"]')).toContainText("Кактус и лайм");
  await page.locator('[data-testid="catalog-flavor-card-kaktus-laym"]').click();
  await expect(page.locator('[data-testid="catalog-cart"]')).toHaveCount(0);
  await expect(page.locator('input[type="number"]')).toHaveCount(0);
  await page.locator('[data-testid="catalog-card-device-kit"]').click();
  await expect(page.locator('[data-testid="catalog-card-device-kit"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="catalog-flavor-card-vinograd-chernika-ice"]')).toContainText(
    "Виноград, черника и холод",
  );
  await page.locator('[data-testid="catalog-flavor-card-vinograd-chernika-ice"]').click();
  await expect(page.locator('[data-testid="catalog-cart"]')).toHaveCount(0);

  await page.goto("/request");
  await expect(page.locator("h1")).toContainText("Оставить заявку STILNO");
  await expect(page.locator("#partner-form form")).toBeVisible();

  await page.goto("/franchise");
  await expect(page.locator("h1")).toContainText("Запуск STILNO в регионе");
  await expect(page.locator("main")).toContainText("Комплект запуска как брендовый набор");
  await expect(page.locator('select[name="interestFormat"]')).toHaveCount(0);

  await page.goto("/gallery");
  await expect(page.locator("h1")).toContainText("Визуальный код STILNO");
  await expect(page.locator("main")).toContainText("визуальную дисциплину бренда");
});

test("franchise lead is delivered without optional marketing consent and redirects to thank-you", async ({ page }, testInfo) => {
  webhookRequests.length = 0;
  await setLeadClientKey(page, `franchise-${testInfo.project.name}`);
  await seedConsent(page);
  await page.goto("/franchise#franchise-form");
  const form = page.locator("#franchise-form form").first();
  await backdateStartedAt(form);
  await form.locator('input[name="name"]').fill("Франчайзи тест");
  await form.locator('input[name="phone"]').fill("+7 999 244-28-36");
  await form.locator('input[name="email"]').fill("franchise@example.com");
  await form.locator('input[name="city"]').fill("Санкт-Петербург");
  await form.locator('input[name="ageConfirmed"]').check();
  await form.locator('input[name="personalData"]').check();
  await form.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page).toHaveURL(/\/thank-you\/franchise/);
  await expect.poll(() => webhookRequests.length).toBe(1);
  expect(webhookRequests[0].leadId).toBeTruthy();
  expect(webhookRequests[0].type).toBe("franchise");
  expect(webhookRequests[0].pageUrl).toBe("/franchise");
  expect(webhookRequests[0].fields).toMatchObject({
    name: "Франчайзи тест",
    phone: "+7 999 244-28-36",
    email: "franchise@example.com",
    city: "Санкт-Петербург",
  });
  expect(webhookRequests[0].consents).toMatchObject({
    ageConfirmed: true,
    personalData: true,
    marketing: false,
  });
});

test("lead API rejects invalid select values without webhook delivery", async ({ request }, testInfo) => {
  webhookRequests.length = 0;

  const response = await request.post("/api/leads", {
    headers: {
      "x-forwarded-for": `invalid-select-${testInfo.project.name}`,
    },
    data: {
      type: "partner",
      pageUrl: "/request",
      startedAt: Date.now() - 3000,
      fields: {
        name: "B2B тест",
        phone: "+7 999 244-28-36",
        email: "partner@example.com",
        city: "Москва",
        requestType: "invalid-kind",
      },
      consents: {
        ageConfirmed: true,
        personalData: true,
      },
    },
  });

  expect(response.status()).toBe(400);
  await expect(await response.json()).toEqual({
    ok: false,
    message: "Неизвестный тип запроса.",
  });
  expect(webhookRequests).toHaveLength(0);
});

test("SEO metadata includes canonical and OG image", async ({ page }) => {
  await seedConsent(page);
  await page.goto("/verify");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://localhost:3010/verify");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "http://localhost:3010/stilno/redesign/og-stilno.svg",
  );
});

test("mobile menu opens key navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only smoke");

  await seedConsent(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  const menu = page.getByRole("dialog", { name: "Мобильное меню" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Бренд" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Каталог" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Оставить заявку" })).toBeVisible();
});

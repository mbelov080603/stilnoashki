import http from "node:http";

import { expect, type Page, test } from "@playwright/test";

const publicPaths = [
  "/",
  "/products/stilno-click-one",
  "/partners",
  "/partners/media-kit",
  "/franchise",
  "/stores",
  "/stores/moscow",
  "/stores/moscow/stilno-vavilon",
  "/verify",
  "/support",
  "/gallery",
  "/careers",
  "/articles",
  "/faq",
];

type WebhookLead = {
  leadId?: string;
  fields?: Record<string, string>;
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
    await expect(page.locator("h1").first()).toBeVisible();
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
  await page.locator('input[placeholder="STILNO-XXXX-XXXX"]').fill("STILNO-CLICK-15000");
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

test("retail lead is delivered to durable webhook and redirects to thank-you", async ({ page }) => {
  webhookRequests.length = 0;
  await seedConsent(page);
  await page.goto("/stores#stores-request");
  const form = page.locator("form").filter({ hasText: "Розничный запрос" }).first();
  await form.locator('input[name="startedAt"]').evaluate((element) => {
    (element as HTMLInputElement).value = String(Date.now() - 3000);
  });
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

test("SEO metadata includes canonical and OG image", async ({ page }) => {
  await seedConsent(page);
  await page.goto("/verify");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://localhost:3010/verify");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "http://localhost:3010/stilno/photos/product-pack-ananas-mango.jpg",
  );
});

test("mobile menu opens key navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only smoke");

  await seedConsent(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  const menu = page.getByRole("dialog", { name: "Мобильное меню" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Проверка" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Где купить" })).toBeVisible();
});

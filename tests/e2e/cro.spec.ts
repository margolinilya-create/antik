import { test, expect } from "@playwright/test";

test("about page renders trust content", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Гарантия подлинности").first()).toBeVisible();
});

test("FAQ page has FAQPage JSON-LD", async ({ page }) => {
  await page.goto("/faq");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"FAQPage"');
  expect(ld).toContain('"Question"');
});

test("journal lists posts and a post has Article JSON-LD", async ({ page }) => {
  await page.goto("/journal");
  const first = page.locator('a[href^="/journal/"]').first();
  await expect(first).toBeVisible();
  const href = await first.getAttribute("href");
  await first.click();
  await page.waitForURL(`**${href}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"Article"');
});

test("sell page has a valuation form", async ({ page }) => {
  await page.goto("/sell");
  await expect(page.getByRole("button", { name: "Отправить на оценку" })).toBeVisible();
});

test("guarantees and sold archive pages render", async ({ page }) => {
  await page.goto("/guarantees");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Гарантии");
  await page.goto("/prodano");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Архив проданного");
});

test("item page shows make-offer, trust badges and related items", async ({ page }) => {
  await page.goto("/item/chashka-kuznetsov-modern");
  await expect(page.getByRole("button", { name: "Сделать предложение" })).toBeVisible();
  await expect(page.getByText("Подлинность гарантирована")).toBeVisible();
  await expect(page.getByText("Единственный экземпляр").first()).toBeVisible();
});

test("favorites: add from item card heart, see on /favorites", async ({ page }) => {
  await page.goto("/catalog");
  await page.locator('button[aria-label="В избранное"]').first().click();
  await page.goto("/favorites");
  await expect(page.locator('a[href^="/item/"]').first()).toBeVisible();
});

test("newsletter signup accepts an email", async ({ page }) => {
  // Dismiss the cookie banner so it doesn't overlay the footer form.
  await page.addInitScript(() => {
    try {
      localStorage.setItem("antik-cookie-consent", "1");
    } catch {
      /* ignore */
    }
  });
  await page.goto("/");
  const form = page.locator('form:has(input[name="email"])').last();
  await form.locator('input[name="email"]').fill("e2e-test@example.com");
  await form.locator('input[name="consent"]').check(); // 152-ФЗ consent required
  await form.getByRole("button", { name: /Подписаться/ }).click();
  await expect(page.getByText("Вы подписаны")).toBeVisible();
});

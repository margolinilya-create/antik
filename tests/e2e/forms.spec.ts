import { test, expect } from "@playwright/test";

// Dismiss the cookie banner so it never overlays form controls.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("antik-cookie-consent", "1");
    } catch {
      /* ignore */
    }
  });
});

test("sell form requires consent, then submits", async ({ page }) => {
  await page.goto("/sell");
  await page.locator("#sell-name").fill("E2E Тест");
  await page.locator("#sell-email").fill("e2e-sell@example.com");

  const submit = page.getByRole("button", { name: "Отправить на оценку" });
  // Consent is unchecked → native required validation blocks submit.
  await submit.click();
  await expect(page.getByText("Заявка отправлена")).toHaveCount(0);

  await page.locator("#sell-consent").check();
  await submit.click();
  await expect(page.getByText("Заявка отправлена")).toBeVisible();
});

test("make-offer submits with consent", async ({ page }) => {
  await page.goto("/item/samovar-ryumka-batashev");
  await page.getByRole("button", { name: "Сделать предложение" }).click();
  await page.locator('input[name="offer_amount"]').fill("65000");
  await page.locator('input[name="customer_name"]').fill("E2E Тест");
  await page.locator('input[name="phone"]').fill("+70000000000");
  await page.locator("#offer-consent").check();
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.getByText("Предложение отправлено")).toBeVisible();
});

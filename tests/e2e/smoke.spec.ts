import { test, expect } from "@playwright/test";

test("home renders hero, nav and item cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Предметы с историей");
  await expect(page.getByRole("link", { name: "Бренды" }).first()).toBeVisible();
  // at least a few item cards link to item pages
  await expect(page.locator('a[href^="/item/"]').first()).toBeVisible();
  const count = await page.locator('a[href^="/item/"]').count();
  expect(count).toBeGreaterThanOrEqual(4);
});

test("catalog lists items", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { name: "Каталог" })).toBeVisible();
  const count = await page.locator('a[href^="/item/"]').count();
  expect(count).toBeGreaterThan(5);
});

test("item page has price and valid Product JSON-LD", async ({ page }) => {
  await page.goto("/item/samovar-ryumka-batashev");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const joined = blocks.join("\n");
  expect(joined).toContain('"Product"');
  expect(joined).toContain('"Offer"');
  expect(joined).toContain('"BreadcrumbList"');
});

test("brands index lists 20 brands", async ({ page }) => {
  await page.goto("/brands");
  await expect(page.getByRole("heading", { name: "Бренды антиквариата" })).toBeVisible();
  const links = await page.locator('a[href^="/maker/"]').count();
  expect(links).toBe(20);
});

test("brand page renders story and Brand JSON-LD", async ({ page }) => {
  await page.goto("/maker/faberge");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Фаберже");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain('"Brand"');
  await expect(page.getByText("1842", { exact: false }).first()).toBeVisible();
});

test("search returns results for a Russian query", async ({ page }) => {
  await page.goto("/search?q=самовар");
  await expect(page.locator('a[href^="/item/"]').first()).toBeVisible();
});

test("cart: add an item then see it in the подборка", async ({ page }) => {
  await page.goto("/item/chashka-kuznetsov-modern");
  await page.getByRole("button", { name: "Добавить в подборку" }).click();
  await page.goto("/cart");
  await expect(page.locator('a[href^="/item/"]').first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Отправить заявку" })).toBeVisible();
});

test("admin is gated to the login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});

test("robots.txt and sitemap.xml are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Disallow: /admin");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/item/");
  expect(xml).toContain("/maker/");
});

import { test, expect, type Page } from "@playwright/test";

// Mask external (Supabase) images so snapshots are stable across image
// content/load timing — visual regression focuses on layout, typography, theme.
async function snapshot(page: Page, name: string) {
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    mask: [page.locator("img")],
  });
}

test("visual: home", async ({ page }) => {
  await page.goto("/");
  await snapshot(page, "home.png");
});

test("visual: catalog", async ({ page }) => {
  await page.goto("/catalog");
  await snapshot(page, "catalog.png");
});

test("visual: brands index", async ({ page }) => {
  await page.goto("/brands");
  await snapshot(page, "brands.png");
});

test("visual: brand page", async ({ page }) => {
  await page.goto("/maker/faberge");
  await snapshot(page, "maker-faberge.png");
});

test("visual: item page", async ({ page }) => {
  await page.goto("/item/samovar-ryumka-batashev");
  await snapshot(page, "item.png");
});

test("visual: home (mobile)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await snapshot(page, "home-mobile.png");
});

import { test, expect } from "@playwright/test";

/**
 * Testes de responsividade: garantem que a aplicação se comporta corretamente
 * em diferentes larguras de tela (mobile, tablet, desktop) sem overflow horizontal
 * e com conteúdo principal visível e utilizável.
 */

/** Tolerância em px para considerar ausência de scroll horizontal (subpixel/rounding). */
const HORIZONTAL_OVERFLOW_TOLERANCE = 2;

async function expectNoHorizontalOverflow(page: { evaluate: (fn: () => number) => Promise<number>; viewportSize: () => { width: number } }) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = page.viewportSize()!.width;
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + HORIZONTAL_OVERFLOW_TOLERANCE);
}

const VIEWPORTS = [
  { name: "320px (mobile mínimo)", width: 320, height: 568 },
  { name: "375px (iPhone SE)", width: 375, height: 667 },
  { name: "768px (tablet)", width: 768, height: 1024 },
  { name: "1280px (desktop)", width: 1280, height: 720 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`Responsividade @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("home: sem overflow horizontal", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: "Login", exact: true })
      ).toBeVisible({ timeout: 15_000 });
      await expectNoHorizontalOverflow(page);
    });

    test("home: formulário de login visível e utilizável", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: "Login", exact: true })
      ).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Senha" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Criar conta" })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });

    test("register: sem overflow horizontal", async ({ page }) => {
      await page.goto("/register");
      await expect(
        page.getByRole("heading", { name: "Registro", exact: true })
      ).toBeVisible({ timeout: 15_000 });
      await expectNoHorizontalOverflow(page);
    });

    test("register: formulário com campos principais visíveis", async ({ page }) => {
      await page.goto("/register");
      await expect(
        page.getByRole("heading", { name: "Registro", exact: true })
      ).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("textbox", { name: "Nome Completo" })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Registrar", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Entrar agora" })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  });
}

test.describe("Responsividade - navegação em viewport mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("home -> Criar conta -> register sem overflow", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("register -> Entrar agora -> home sem overflow", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Entrar agora" }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});

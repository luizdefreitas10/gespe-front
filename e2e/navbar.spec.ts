import { test, expect } from "@playwright/test";

test.describe("Navbar (usuário não autenticado)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("deve exibir botões REGISTRAR-SE e ENTRAR no desktop", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "REGISTRAR-SE", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ENTRAR", exact: true })
    ).toBeVisible();
  });

  test("deve exibir logo da ARPE", async ({ page }) => {
    const logo = page.getByRole("img", { name: "light logo arpe" });
    await expect(logo).toBeVisible();
  });

  test("REGISTRAR-SE deve estar visível e clicável", async ({ page }) => {
    const btn = page.getByRole("button", { name: "REGISTRAR-SE", exact: true });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();
  });

  test("ENTRAR na home deve manter na mesma página (já estamos na login)", async ({
    page,
  }) => {
    const btn = page.getByRole("button", { name: "ENTRAR", exact: true });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
  });
});

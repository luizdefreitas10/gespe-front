import { test, expect } from "@playwright/test";

test.describe("Navegação entre páginas", () => {
  test("Home -> Registro -> Home", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();

    await page.getByRole("button", { name: "Entrar agora" }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
  });

  test("Navbar REGISTRAR-SE na home leva ao registro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "REGISTRAR-SE", exact: true }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();
  });

  test("Na página de registro, navbar ENTRAR deve levar à home", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "ENTRAR", exact: true }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Página inicial (Home)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("deve exibir o formulário de login", async ({ page }) => {
    await expect(
      page.getByRole("textbox", { name: "Email" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Senha" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Criar conta" })
    ).toBeVisible();
  });

  test("deve ter link para criar conta que leva à página de registro", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();
  });

  test("deve exibir validação ao submeter login com campos vazios", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("deve preencher email e senha e manter o usuário na página de login", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "Email" }).fill("teste@exemplo.com");
    await page.getByRole("textbox", { name: "Senha" }).fill("senha123");
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(
      "teste@exemplo.com"
    );
    await expect(
      page.getByRole("button", { name: "Entrar", exact: true })
    ).toBeVisible();
  });
});

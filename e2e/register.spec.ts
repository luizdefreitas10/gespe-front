import { test, expect } from "@playwright/test";

test.describe("Página de registro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("deve exibir o formulário de registro com todos os campos", async ({
    page,
  }) => {
    await expect(
      page.getByRole("textbox", { name: "Nome Completo" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Email" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Senha" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Matrícula" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Data de Nascimento" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Cargo" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Departamento" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Registrar", exact: true })
    ).toBeVisible();
  });

  test("deve ter botão Entrar agora que volta para a home", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Entrar agora" }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Login", exact: true })
    ).toBeVisible();
  });

  test("deve exibir validação ao submeter com campos vazios", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Registrar", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Registro", exact: true })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  test("deve preencher campos e manter valores", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Nome Completo" })
      .fill("Fulano da Silva");
    await page
      .getByRole("textbox", { name: "Email" })
      .fill("fulano@exemplo.com");
    await page.getByRole("textbox", { name: "Senha" }).fill("senhaSegura123");
    await page.getByRole("textbox", { name: "Matrícula" }).fill("12345");
    await page.getByRole("textbox", { name: "Cargo" }).fill("Analista");
    await page
      .getByRole("textbox", { name: "Departamento" })
      .fill("TI");

    await expect(
      page.getByRole("textbox", { name: "Nome Completo" })
    ).toHaveValue("Fulano da Silva");
    await expect(
      page.getByRole("textbox", { name: "Email" })
    ).toHaveValue("fulano@exemplo.com");
    await expect(
      page.getByRole("textbox", { name: "Matrícula" })
    ).toHaveValue("12345");
  });
});

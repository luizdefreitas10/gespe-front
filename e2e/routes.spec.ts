import { test, expect } from "@playwright/test";

test.describe("Rotas da aplicação", () => {
  test("rota / responde com status 200", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
  });

  test("rota /register responde com status 200", async ({ page }) => {
    const res = await page.goto("/register");
    expect(res?.status()).toBe(200);
  });

  test("rota /gestor carrega sem erro (conteúdo depende de auth)", async ({
    page,
  }) => {
    const res = await page.goto("/gestor");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/gestor/);
  });

  test("rota /user carrega sem erro (conteúdo depende de auth)", async ({
    page,
  }) => {
    const res = await page.goto("/user");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/user/);
  });
});

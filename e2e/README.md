# Testes E2E (Playwright)

Testes de ponta a ponta do frontend com **Playwright**.

## Pré-requisitos

1. **Instalar os browsers do Playwright** (uma vez no projeto):

   ```bash
   npx playwright install
   ```

   Para instalar só o Chromium:

   ```bash
   npx playwright install chromium
   ```

2. **Servidor rodando** (opcional): se você já tiver `npm run dev` rodando na porta 3000, o Playwright reutiliza o servidor. Caso contrário, ele inicia o `npm run dev` automaticamente (exceto em CI).

## Comandos

| Comando              | Descrição                          |
|----------------------|------------------------------------|
| `npm run test:e2e`   | Roda todos os testes E2E           |
| `npm run test:e2e:ui`| Abre a UI do Playwright            |
| `npm run test:e2e:headed` | Roda com o browser visível   |
| `npm run test:e2e:report` | Abre o último relatório HTML  |

## Estrutura dos testes

- **home.spec.ts** – Página inicial: formulário de login, link para registro, validação e preenchimento.
- **register.spec.ts** – Página de registro: campos do formulário, botão "Entrar agora", validação.
- **navbar.spec.ts** – Navbar sem login: REGISTRAR-SE, ENTRAR, logo (viewport desktop).
- **navigation.spec.ts** – Fluxos de navegação: Home ↔ Registro.
- **routes.spec.ts** – Rotas `/`, `/register`, `/gestor`, `/user` retornam 200.
- **responsiveness.spec.ts** – Responsividade: sem overflow horizontal e conteúdo utilizável em 320px, 375px, 768px e 1280px (home, register e navegação).

## Rodar um arquivo ou um teste

```bash
npx playwright test e2e/home.spec.ts
npx playwright test e2e/home.spec.ts -g "deve exibir o formulário"
npx playwright test --project=chromium
# Apenas testes de responsividade:
npx playwright test e2e/responsiveness.spec.ts
npx playwright test e2e/responsiveness.spec.ts --project=chromium
```

## CI

Em ambiente de CI, defina `CI=1` para o Playwright subir o servidor antes dos testes. Certifique-se de ter rodado `npx playwright install` (ou `npx playwright install --with-deps` em Linux) no pipeline.

---

## Como usar o MCP Playwright para explorar o app ao vivo

O **MCP Playwright** (Cursor) controla um navegador real. Use-o para inspecionar a página e descobrir **roles, nomes e refs** antes de escrever ou corrigir testes.

### 1. Deixe o app rodando

```bash
npm run dev
```

### 2. Fluxo básico no Cursor

1. **Abrir a página**  
   Peça ao assistente: “Use o MCP Playwright para navegar para http://localhost:3000”.  
   Ou use a ferramenta `browser_navigate` com `url: "http://localhost:3000"`.

2. **Ver a árvore de acessibilidade (snapshot)**  
   Peça: “Faça um snapshot da página com o MCP Playwright”.  
   A ferramenta `browser_snapshot` devolve algo como:
   ```yaml
   - heading "Login" [level=1] [ref=e9]
   - textbox "Email" [ref=e15]
   - textbox "Senha" [ref=e20]
   - button "Entrar" [ref=e21]
   - button "Criar conta" [ref=e29]
   ```
   Daí você sabe os **nomes acessíveis** para usar nos testes:  
   `getByRole("heading", { name: "Login" })`, `getByRole("textbox", { name: "Email" })`, etc.

3. **Ajustar viewport (desktop vs mobile)**  
   Os botões “REGISTRAR-SE” e “ENTRAR” ficam em `hidden sm:flex`; em viewport &lt; 640px não aparecem na navbar.  
   - **Desktop:** use `browser_resize` com `width: 1280`, `height: 720` e depois `browser_snapshot` — aparecem `button "REGISTRAR-SE"` e `button "ENTRAR"`.  
   - **Mobile:** use `browser_resize` com `width: 375`, `height: 667` (ou 320x568) e faça `browser_snapshot` — o formulário de login e “Criar conta” continuam visíveis; use o snapshot para inspecionar elementos antes de escrever testes de responsividade.

4. **Clicar em um elemento**  
   Para testar um fluxo (ex.: ir para o registro), use o **ref** do snapshot:  
   `browser_click` com `ref: "e29"` (exemplo do botão “Criar conta”).  
   Depois faça outro `browser_snapshot` na nova página para ver os elementos de “Registro”.

### 3. Mapeamento snapshot → teste

| No snapshot              | No teste Playwright |
|--------------------------|----------------------|
| `heading "Login"`        | `page.getByRole("heading", { name: "Login" })` |
| `textbox "Email"`        | `page.getByRole("textbox", { name: "Email" })` |
| `button "Criar conta"`   | `page.getByRole("button", { name: "Criar conta" })` |
| `img "light logo arpe"`  | `page.getByRole("img", { name: "light logo arpe" })` |

Preferir **getByRole** com o **name** que aparece no snapshot deixa os testes estáveis e alinhados à árvore de acessibilidade.

### 4. Ferramentas úteis do MCP

| Ferramenta           | Uso |
|----------------------|-----|
| `browser_tabs`       | Listar/abrir/fechar abas (`action: "list"` ou `"new"`). |
| `browser_navigate`   | Ir para uma URL (ex.: home, `/register`). |
| `browser_snapshot`   | Ver árvore de acessibilidade e refs da página atual. |
| `browser_resize`     | Definir largura/altura (ex.: 1280x720 para desktop). |
| `browser_click`      | Clicar em elemento pelo `ref` do snapshot. |
| `browser_type`       | Digitar em campo (usar `ref` do textbox). |
| `browser_take_screenshot` | Capturar screenshot da página. |

Sempre que mudar de página ou de estado, tire um **novo snapshot** para obter os refs e nomes atuais antes de clicar ou digitar.

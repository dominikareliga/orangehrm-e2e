import { test as setup, expect } from "@playwright/test";
import { config } from "../config";
import { LoginPage } from "../page-objects/auth/login.page";
import { routes } from "../routes";

// Logs in once per run and saves the session, so the tests start signed in
// instead of each going through the login form.
setup("sign in as admin", async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.signIn(config.username, config.password);
  await expect(page).toHaveURL(routes.dashboard, { timeout: 30_000 });
  await page.context().storageState({ path: config.adminStorageState });
});

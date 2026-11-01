import { test, expect } from '../../fixtures';
import { config } from '../../config';
import { routes } from '../../routes';

test.use({ storageState: { cookies: [], origins: [] } });

test('Verify that an admin can log in', { tag: '@auth' }, async ({ app, page }) => {
  await app.auth.login.goto();
  await app.auth.login.signIn(config.username, config.password);

  await expect(page).toHaveURL(routes.dashboard, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

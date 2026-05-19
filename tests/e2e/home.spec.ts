import { expect, test } from '@playwright/test';

test('home: theme + locale switching works', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'RU' }).click();
  await expect(page).toHaveURL(/\/ru\/?$/);

  await page.getByRole('button', { name: /dark|тёмная/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$/);
});

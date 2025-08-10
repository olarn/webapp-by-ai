import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Verify the page loads
    await expect(page).toBeVisible();

    // Check if the page has a title
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verify the page is responsive
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have basic page structure', async ({ page }) => {
    await page.goto('/');

    // Check for basic HTML structure
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('head')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle basic navigation', async ({ page }) => {
    await page.goto('/');

    // Verify we can navigate to the same page again
    await page.goto('/');
    await expect(page).toBeVisible();
  });

  test('should display course list on homepage', async ({ page }) => {
    await page.goto('/');

    // Verify course list is displayed (if data-testid exists)
    try {
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
    } catch {
      // If data-testid doesn't exist, check for course-related content
      await expect(page.locator('body')).toContainText(/course|Course/);
    }
  });
});

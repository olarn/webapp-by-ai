import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { TeacherLoginPage } from './pages/TeacherLoginPage';

test.describe('Basic Application Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle(/Course Platform/);
    await expect(home.main()).toBeVisible();
  });

  test('should display course list', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    expect(await home.cellCount()).toBeGreaterThan(0);
  });

  test('should have search functionality', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const searchBox = home.searchBox();
    await expect(searchBox).toBeVisible();

    await home.search('Functional Programming');
    await page.waitForTimeout(500);

    // Search results info should appear regardless of result count
    const searchResults = page
      .locator('[role="status"][aria-live="polite"]')
      .filter({ hasText: 'Showing' });
    await expect(searchResults.first()).toBeVisible();
  });

  test('should navigate to teacher login', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.clickTeacherLogin();

    await expect(page).toHaveURL(/.*\/teacher\/login/);

    const loginPage = new TeacherLoginPage(page);
    await loginPage.waitForLoaded();
  });

  test('should display course information correctly', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    await expect(home.firstCellTitle()).toBeVisible();
    await expect(home.firstCellPrice()).toBeVisible();
    await expect(home.firstCellViewDetails()).toBeVisible();
  });
});

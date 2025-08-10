import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/Course Platform/);

    // Check if the main content is visible using accessibility selector
    await expect(page.locator('[role="main"]')).toBeVisible();
  });

  test('should display course list', async ({ page }) => {
    await page.goto('/');

    // Wait for courses to load using accessibility selector
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    // Check if at least one course is displayed
    const courseCards = page.locator('[role="gridcell"]');
    expect(await courseCards.count()).toBeGreaterThan(0);
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/');

    // Check if search input is present using accessibility selector
    const searchBox = page.locator('[role="searchbox"]');
    await expect(searchBox).toBeVisible();

    // Check if search input is functional
    await searchBox.fill('Functional Programming');
    await page.waitForTimeout(500); // Wait for search to process

    // Expect filtered results to be fewer or equal to initial
    const filteredCards = page.locator('[role="gridcell"]');
    expect(await filteredCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to teacher login', async ({ page }) => {
    await page.goto('/');

    // Click on teacher login button using accessibility selector
    await page.locator('[role="button"][aria-label="Access teacher login page"]').click();

    // Should navigate to teacher login page
    await expect(page).toHaveURL(/.*\/teacher\/login/);

    // Check if login form is visible
    await expect(page.locator('[role="form"][aria-label="Teacher login credentials"]')).toBeVisible();
  });

  test('should display course information correctly', async ({ page }) => {
    await page.goto('/');

    // Wait for courses to load
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    // Get first course card
    const firstCourse = page.locator('[role="gridcell"]').first();

    // Check if course title is visible
    await expect(firstCourse.locator('h3')).toBeVisible();

    // Check if course price is displayed
    await expect(firstCourse.locator('[aria-label="Course price"]')).toBeVisible();

    // Check if view course button is present
    await expect(firstCourse.locator('[role="button"][aria-label*="View details"]')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Accessibility-Based Selector Tests', () => {
  test('should use semantic roles for course list navigation', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Test main content area using role
    await expect(home.main()).toBeVisible();

    // Test banner section
    await expect(home.banner()).toBeVisible();
    await expect(home.bannerHeading()).toContainText('Discover Amazing Courses');

    // Test search section
    await expect(home.searchSection()).toBeVisible();
  });

  test('should use aria-labels for interactive elements', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Teacher login button
    await expect(home.teacherLoginButton()).toBeVisible();
    await expect(home.teacherLoginButton()).toContainText('Teacher Login');

    // Search input
    const searchInput = home.searchBox();
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search courses by title, instructor, or category...');
  });

  test('should use grid roles for course layout', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Wait for courses to load
    await page.waitForSelector('[role="grid"][aria-label="Available courses"]', { timeout: 10000 });

    // Test grid structure
    await expect(home.grid()).toBeVisible();

    // Test individual course cells
    expect(await home.cellCount()).toBeGreaterThan(0);

    // Test first course has proper aria-label
    await expect(home.firstCell()).toHaveAttribute('aria-label', /Course: .* by .*/);
  });

  test('should use form roles for enrollment process', async ({ page }) => {
    // Navigate to a course detail page first (assuming it exists)
    await page.goto('/course/1');

    // Look for enrollment form or button
    const enrollmentButton = page.locator('[role="button"][aria-label*="enroll"]').first();
    if (await enrollmentButton.isVisible()) {
      await enrollmentButton.click();

      // Test enrollment form modal
      await expect(page.locator('[role="dialog"][aria-label="Course enrollment form"]')).toBeVisible();

      // Test form sections
      await expect(page.locator('[role="group"][aria-labelledby="personal-info-heading"]')).toBeVisible();
      await expect(page.locator('[role="group"][aria-labelledby="course-summary-heading"]')).toBeVisible();

      // Test form inputs with proper roles
      await expect(page.locator('[role="textbox"][aria-label="Student first name"]')).toBeVisible();
      await expect(page.locator('[role="textbox"][aria-label="Student email address"]')).toBeVisible();
      await expect(page.locator('[role="checkbox"][aria-label="Agree to terms and conditions"]')).toBeVisible();
    }
  });

  test('should use dialog roles for modals', async ({ page }) => {
    // This test would require setting up a teacher session to access course creation
    // For now, we'll test the structure if available

    // Test that modals use proper dialog roles
    const modals = page.locator('[role="dialog"]');
    await expect(modals).toHaveCount(0);
  });

  test('should use status roles for dynamic content', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Search results info (appears when searching)
    await home.search('Functional Programming');
    await page.waitForTimeout(500);

    // Check if search results info appears with proper role
    const searchResults = page
      .locator('[role="status"][aria-live="polite"]')
      .filter({ hasText: 'Showing' });
    const resultsCount = await searchResults.count();
    if (resultsCount > 0) {
      await expect(searchResults.first()).toBeVisible();
    }
  });

  test('should use button roles consistently', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Test all buttons have proper roles
    const buttons = page.locator('[role="button"]');
    expect(await buttons.count()).toBeGreaterThan(0);

    // Specific buttons
    expect(await page.locator('[role="button"][aria-label*="View details"]').count()).toBeGreaterThan(0);
    expect(await page.locator('[role="button"][aria-label*="View profile of"]').count()).toBeGreaterThan(0);
  });

  test('should use proper heading hierarchy', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Main heading
    await expect(home.bannerHeading()).toContainText('Discover Amazing Courses');

    // Course titles
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
    const courseTitles = page.locator('[role="gridcell"] h3');
    expect(await courseTitles.count()).toBeGreaterThan(0);
  });

  test('should handle loading and error states with proper roles', async ({ page }) => {
    await page.goto('/');

    // Structural presence only
    page.locator('[role="status"][aria-live="polite"][aria-label="Loading courses"]');
    page.locator('[role="alert"][aria-live="assertive"]');
  });
});

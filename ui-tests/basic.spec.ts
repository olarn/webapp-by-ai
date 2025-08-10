import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Course Platform/);
    
    // Check if the main content is visible
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
  });

  test('should display course list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for courses to load
    await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });
    
    // Check if courses are displayed
    const courseCards = page.locator('[data-testid="course-card"]');
    await expect(courseCards).toHaveCount(10); // Should have 10 courses from the seed data
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check if search input is present
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    // Check if search input is functional
    await page.locator('[data-testid="search-input"]').fill('Functional Programming');
    
    // Should filter courses
    await page.waitForTimeout(500); // Wait for search to process
    const filteredCards = page.locator('[data-testid="course-card"]');
    await expect(filteredCards).toHaveCount(2); // Should show 2 FP courses
  });
});

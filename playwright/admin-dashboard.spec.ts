import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Analytics', () => {
  test('shows bar charts, pie chart with hover tooltips and details', async ({ page }) => {
    // Go to admin login
    await page.goto('http://localhost:5173/admin/login');

    // Login using seeded creds
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Wait for charts to render
    await expect(page.getByText('New Classes (last 3 months)')).toBeVisible();
    await expect(page.getByText('Total Income (last 3 months)')).toBeVisible();
    await expect(page.getByText('Enrollments Status')).toBeVisible();

    // Verify bar elements render with title tooltips (no hover needed)
    const classBars = page.locator('section:has-text("New Classes (last 3 months)") div[title]');
    const incomeBars = page.locator('section:has-text("Total Income (last 3 months)") div[title]');
    expect(await classBars.count()).toBeGreaterThan(0);
    expect(await incomeBars.count()).toBeGreaterThan(0);
    const firstClassBarTitle = await classBars.first().getAttribute('title');
    expect(firstClassBarTitle).toBeTruthy();
    expect(firstClassBarTitle as string).toMatch(/\d/); // contains a number
    const firstIncomeBarTitle = await incomeBars.first().getAttribute('title');
    expect(firstIncomeBarTitle).toBeTruthy();
    expect(firstIncomeBarTitle as string).toMatch(/\d/);

    // Pie chart exists (svg)
    const pie = page.locator('section:has-text("Enrollments Status") svg');
    await expect(pie).toBeVisible();
    expect(await pie.locator('path[aria-label]').count()).toBeGreaterThan(0);

    // Details headings exist for each section (scoped)
    await expect(
      page
        .locator('section')
        .filter({ hasText: 'New Classes (last 3 months)' })
        .getByRole('heading', { name: 'Details' })
    ).toBeVisible();
    await expect(
      page
        .locator('section')
        .filter({ hasText: 'Total Income (last 3 months)' })
        .getByRole('heading', { name: 'Details' })
    ).toBeVisible();
    await expect(
      page
        .locator('section')
        .filter({ hasText: 'Enrollments Status' })
        .getByRole('heading', { name: 'Details' })
    ).toBeVisible();

    // Responsive layout basic check: two-column on desktop (via CSS grid). Just ensure both graph and details blocks exist
    const sections = page.locator('section.bg-white');
    await expect(sections).toHaveCount(3);
  });
});



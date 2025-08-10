import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CourseDetailPage } from './pages/CourseDetailPage';

// Student happy-path scenarios based on Requirement-Student.txt

test.describe('Student Happy Paths', () => {
  test('US1: See course list on home with ability to scroll', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.main()).toBeVisible();
    await expect(home.grid()).toBeVisible();
    expect(await home.cellCount()).toBeGreaterThan(0);

    // Basic scroll to ensure page scrolls (lazy load placeholder)
    await page.mouse.wheel(0, 800);
  });

  test('US2: Click course name navigates to detail page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    // Click by title inside first cell
    const title = home.firstCellTitle();
    const titleText = await title.textContent();
    await title.click();

    // Expect course detail to show that title
    await expect(page.locator('h1')).toContainText(titleText || '');
  });

  test('US2: Click course image navigates to detail page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    const firstCell = home.firstCell();
    await firstCell.locator('img').first().click();

    await expect(page.locator('h1')).toBeVisible();
  });

  test('US3: Back button returns to course list', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    await home.firstCell().click();

    const detail = new CourseDetailPage(page);
    await expect(detail.title()).toBeVisible();

    await detail.backButton().click();
    await expect(home.main()).toBeVisible();
  });

  test('US4/US5: See teacher profile on course detail and from course list', async ({ page }) => {
    // From course detail
    const home = new HomePage(page);
    await home.goto();
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    await home.firstCell().click();
    const detail = new CourseDetailPage(page);
    await expect(detail.aboutInstructorHeading()).toBeVisible();

    // From list (open teacher modal)
    await page.goBack();
    const teacherButton = page.locator('[role="button"][aria-label*="View profile of"]');
    await teacherButton.first().click();
    await expect(page.getByRole('dialog', { name: 'Teacher profile' })).toBeVisible();
    await page.getByRole('button', { name: 'Close teacher profile' }).click();
  });

  test('US6/US7: Enroll and pay successfully, then return to home', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });

    await home.firstCell().click();
    const detail = new CourseDetailPage(page);

    await detail.enrollNow().click();
    await expect(detail.enrollmentDialog()).toBeVisible();

    await detail.fillEnrollmentForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    });

    await detail.submitEnrollment();

    // Payment flow
    await expect(detail.paymentHeading()).toBeVisible();
    await detail.payButton().click();
    await expect(detail.successDialog()).toBeVisible();
    await detail.continueToHome().click();

    // Back to home
    await expect(home.main()).toBeVisible();
  });
});

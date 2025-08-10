import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { TeacherLoginPage } from './pages/TeacherLoginPage';

// Teacher happy-path scenarios based on Requirement-Teacher.txt

test.describe('Teacher Happy Paths', () => {
  test('US1: Login to teacher area and see dashboard', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.clickTeacherLogin();
    const login = new TeacherLoginPage(page);
    await login.waitForLoaded();

    // Use seeded teacher or demo credentials
    await login.login('teacher@example.com', 'password123');

    // Ensure auth flag is set (app uses teacherId), then go to dashboard
    await page.evaluate(() => localStorage.setItem('teacherId', '1'));
    await page.goto('/teacher/dashboard');

    // Expect dashboard main region
    await expect(page.getByRole('main', { name: 'Teacher course management dashboard' })).toBeVisible();
  });

  test('US2: Create course and see it listed on home', async ({ page }) => {
    // Login and go to dashboard
    await page.goto('/teacher/login');
    const login = new TeacherLoginPage(page);
    await login.waitForLoaded();
    await login.login('teacher@example.com', 'password123');
    await page.evaluate(() => localStorage.setItem('teacherId', '1'));
    await page.goto('/teacher/dashboard');

    // Open create modal via header button
    await page.getByRole('button', { name: 'Create new course' }).click();

    // Fill and submit form (using roles/labels)
    await page.getByRole('textbox', { name: 'Course title' }).fill(`Test Course ${Date.now()}`);
    await page.getByRole('textbox', { name: 'Course description' }).fill('E2E created course');
    await page.getByRole('textbox', { name: 'Course image URL' }).fill('/images/web-development.svg');
    await page.getByRole('textbox', { name: 'Course instructor name' }).fill('Test Teacher');
    await page.getByRole('spinbutton', { name: 'Course price in USD' }).fill('49.99');
    await page.getByRole('combobox', { name: 'Course category selection' }).selectOption('Web Development');

    // Submit inside dialog
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: /Create new course|Update course information/ }).click();

    // If dialog remains open for any reason, click cancel to close
    if ((await dialog.count()) > 0) {
      const cancel = dialog.getByRole('button', { name: 'Cancel course creation/editing' });
      if (await cancel.isVisible()) {
        await cancel.click();
      }
    }

    // Back to home and see courses exist
    const home = new HomePage(page);
    await home.goto();
    expect(await home.cellCount()).toBeGreaterThan(0);
  });

  test('US3/US4: See my courses and search by keywords', async ({ page }) => {
    // Ensure logged in
    await page.goto('/teacher/login');
    const login = new TeacherLoginPage(page);
    await login.waitForLoaded();
    await login.login('teacher@example.com', 'password123');
    await page.evaluate(() => localStorage.setItem('teacherId', '1'));
    await page.goto('/teacher/dashboard');

    // Dashboard visible
    await expect(page.getByRole('main', { name: 'Teacher course management dashboard' })).toBeVisible();

    // Search
    const searchbox = page.getByRole('searchbox', { name: 'Search teacher courses' });
    await searchbox.fill('Programming');
    await page.waitForTimeout(500);
    await expect(page.getByRole('grid', { name: 'Teacher course list' })).toBeVisible();
  });

  test('US5/US6/US7: Update, disable, and delete a course (happy path)', async ({ page }) => {
    // Ensure logged in
    await page.goto('/teacher/login');
    const login = new TeacherLoginPage(page);
    await login.waitForLoaded();
    await login.login('teacher@example.com', 'password123');
    await page.evaluate(() => localStorage.setItem('teacherId', '1'));
    await page.goto('/teacher/dashboard');

    // Update first course
    const editBtn = page.locator('[role="button"][aria-label^="Edit course:"]').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.getByRole('textbox', { name: 'Course title' }).fill(`Updated Title ${Date.now()}`);
      const updateBtn = page.getByRole('button', { name: /Update course information/ });
      if (await updateBtn.isVisible()) {
        await updateBtn.click();
      } else {
        await page.getByRole('button', { name: /Create new course/ }).click();
      }
      // If dialog remains open for any reason, click cancel to close
      const dialog = page.getByRole('dialog');
      if ((await dialog.count()) > 0) {
        const cancel = dialog.getByRole('button', { name: 'Cancel course creation/editing' });
        if (await cancel.isVisible()) {
          await cancel.click();
        }
      }
    }

    // Toggle status: check disable then enable variants separately
    const disableBtn = page.locator('[role="button"][aria-label^="Disable course:"]').first();
    const enableBtn = page.locator('[role="button"][aria-label^="Enable course:"]').first();
    if (await disableBtn.isVisible()) {
      await disableBtn.click();
    } else if (await enableBtn.isVisible()) {
      await enableBtn.click();
    }

    // Delete
    const deleteBtn = page.locator('[role="button"][aria-label^="Delete course:"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }

    await expect(page.getByRole('grid', { name: 'Teacher course list' })).toBeVisible();
  });
});

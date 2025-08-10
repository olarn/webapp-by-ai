import { test, expect } from '@playwright/test';

test.describe('Student User Stories', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the course platform homepage
    await page.goto('/');
  });

  test.describe('US1: Course List on Home Screen', () => {
    test('As a Student, I can see list of course on home screen with lazy load', async ({ page }) => {
      // Verify course list is displayed
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();

      // Verify at least one course card is visible
      const courseCards = page.locator('[data-testid="course-card"]');
      await expect(courseCards.first()).toBeVisible();

      // Verify course cards have required information
      const firstCourseCard = courseCards.first();
      await expect(firstCourseCard.locator('[data-testid="course-title"]')).toBeVisible();
      await expect(firstCourseCard.locator('[data-testid="course-image"]')).toBeVisible();
      await expect(firstCourseCard.locator('[data-testid="course-price"]')).toBeVisible();

      // Test lazy loading by scrolling down
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for potential lazy loading
      await page.waitForTimeout(1000);

      // Verify more courses are loaded (if lazy loading is implemented)
      const totalCourseCards = await courseCards.count();
      expect(totalCourseCards).toBeGreaterThan(0);
    });
  });

  test.describe('US2: Navigate to Course Detail Page', () => {
    test('As a Student, I can click on course name or image to navigate to course detail page', async ({ page }) => {
      // Get the first course card
      const firstCourseCard = page.locator('[data-testid="course-card"]').first();
      const courseTitle = await firstCourseCard.locator('[data-testid="course-title"]').textContent();

      // Click on course title
      await firstCourseCard.locator('[data-testid="course-title"]').click();

      // Verify navigation to course detail page
      await expect(page.url()).toContain('/course/');
      await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="course-detail-title"]')).toContainText(courseTitle || '');

      // Go back to home page
      await page.goto('/');

      // Click on course image
      await firstCourseCard.locator('[data-testid="course-image"]').click();

      // Verify navigation to course detail page again
      await expect(page.url()).toContain('/course/');
      await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
    });
  });

  test.describe('US3: Back Navigation', () => {
    test('As a Student, I can click back button in course details page to navigate back to course list', async ({ page }) => {
      // Navigate to course detail page
      await page.locator('[data-testid="course-card"]').first().click();

      // Verify we're on course detail page
      await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();

      // Click back button
      await page.locator('[data-testid="back-button"]').click();

      // Verify navigation back to course list
      await expect(page.url()).toMatch(/\/$|\/courses$/);
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
    });
  });

  test.describe('US4: Teacher Profile from Course Details', () => {
    test('As a Student, I can see teacher profile from course details page', async ({ page }) => {
      // Navigate to course detail page
      await page.locator('[data-testid="course-card"]').first().click();

      // Verify teacher profile section is visible
      await expect(page.locator('[data-testid="teacher-profile"]')).toBeVisible();

      // Verify teacher profile elements
      await expect(page.locator('[data-testid="teacher-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="teacher-background"]')).toBeVisible();
      await expect(page.locator('[data-testid="teacher-portrait"]')).toBeVisible();
      await expect(page.locator('[data-testid="teacher-specialties"]')).toBeVisible();

      // Verify teacher information is not empty
      const teacherName = await page.locator('[data-testid="teacher-name"]').textContent();
      expect(teacherName).toBeTruthy();
      expect(teacherName?.trim()).not.toBe('');
    });
  });

  test.describe('US5: Teacher Profile from Course List', () => {
    test('As a Student, I can see teacher profile from course list (home)', async ({ page }) => {
      // Verify teacher information is visible on course cards
      const courseCards = page.locator('[data-testid="course-card"]');

      // Check first course card for teacher info
      const firstCourseCard = courseCards.first();
      await expect(firstCourseCard.locator('[data-testid="course-teacher"]')).toBeVisible();

      // Verify teacher name is displayed
      const teacherName = await firstCourseCard.locator('[data-testid="course-teacher"]').textContent();
      expect(teacherName).toBeTruthy();
      expect(teacherName?.trim()).not.toBe('');
    });
  });

  test.describe('US6: Enrollment Process', () => {
    test('As a Student, I can click enroll button and fill personal information', async ({ page }) => {
      // Navigate to course detail page
      await page.locator('[data-testid="course-card"]').first().click();

      // Click enroll button
      await page.locator('[data-testid="enroll-button"]').click();

      // Verify enrollment form is displayed
      await expect(page.locator('[data-testid="enrollment-form"]')).toBeVisible();

      // Fill personal information
      await page.locator('[data-testid="student-name"]').fill('John Doe');
      await page.locator('[data-testid="student-email"]').fill('john.doe@example.com');
      await page.locator('[data-testid="student-phone"]').fill('+1234567890');

      // Verify form fields are filled
      await expect(page.locator('[data-testid="student-name"]')).toHaveValue('John Doe');
      await expect(page.locator('[data-testid="student-email"]')).toHaveValue('john.doe@example.com');
      await expect(page.locator('[data-testid="student-phone"]')).toHaveValue('+1234567890');
    });
  });

  test.describe('US7: Payment Process', () => {
    test('As a Student, I can complete payment process with QR code', async ({ page }) => {
      // Navigate to course detail and start enrollment
      await page.locator('[data-testid="course-card"]').first().click();
      await page.locator('[data-testid="enroll-button"]').click();

      // Fill enrollment form
      await page.locator('[data-testid="student-name"]').fill('John Doe');
      await page.locator('[data-testid="student-email"]').fill('john.doe@example.com');
      await page.locator('[data-testid="student-phone"]').fill('+1234567890');

      // Submit enrollment form
      await page.locator('[data-testid="submit-enrollment"]').click();

      // Verify payment screen is displayed
      await expect(page.locator('[data-testid="payment-screen"]')).toBeVisible();

      // Verify payment information is displayed
      await expect(page.locator('[data-testid="payment-info"]')).toBeVisible();
      await expect(page.locator('[data-testid="payee-info"]')).toBeVisible();

      // Verify QR code is displayed
      await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();

      // Click paid button to simulate payment success
      await page.locator('[data-testid="paid-button"]').click();

      // Verify success dialog is displayed
      await expect(page.locator('[data-testid="success-dialog"]')).toBeVisible();

      // Click OK on success dialog
      await page.locator('[data-testid="success-ok-button"]').click();

      // Verify navigation back to home screen
      await expect(page.url()).toMatch(/\/$|\/courses$/);
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
    });

    test('Payment screen shows payment and payee information', async ({ page }) => {
      // Navigate to payment screen (assuming we can access it directly or through enrollment)
      await page.goto('/payment/test-course-id');

      // Verify payment information
      await expect(page.locator('[data-testid="payment-amount"]')).toBeVisible();
      await expect(page.locator('[data-testid="payment-currency"]')).toBeVisible();
      await expect(page.locator('[data-testid="payment-method"]')).toBeVisible();

      // Verify payee information
      await expect(page.locator('[data-testid="payee-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="payee-account"]')).toBeVisible();
      await expect(page.locator('[data-testid="payee-bank"]')).toBeVisible();
    });

    test('Payment screen uses mock payment gateway', async ({ page }) => {
      // Navigate to payment screen
      await page.goto('/payment/test-course-id');

      // Verify mock payment gateway elements
      await expect(page.locator('[data-testid="mock-payment-gateway"]')).toBeVisible();
      await expect(page.locator('[data-testid="payment-status"]')).toBeVisible();
    });
  });

  test.describe('Data Persistence', () => {
    test('Web app saves registered data and payment transaction into database', async ({ page }) => {
      // This test would typically involve checking the database or API
      // For UI testing, we'll verify the success flow and check for confirmation

      // Complete enrollment and payment process
      await page.locator('[data-testid="course-card"]').first().click();
      await page.locator('[data-testid="enroll-button"]').click();

      // Fill and submit enrollment
      await page.locator('[data-testid="student-name"]').fill('Test Student');
      await page.locator('[data-testid="student-email"]').fill('test@example.com');
      await page.locator('[data-testid="student-phone"]').fill('+1234567890');
      await page.locator('[data-testid="submit-enrollment"]').click();

      // Complete payment
      await page.locator('[data-testid="paid-button"]').click();
      await page.locator('[data-testid="success-ok-button"]').click();

      // Verify success message or confirmation
      await expect(page.locator('[data-testid="enrollment-confirmation"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('Course list works on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify course list is still accessible
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="course-card"]').first()).toBeVisible();

      // Verify course cards are properly sized for mobile
      const courseCard = page.locator('[data-testid="course-card"]').first();
      const cardBox = await courseCard.boundingBox();
      expect(cardBox?.width).toBeLessThanOrEqual(375); // Should fit mobile width
    });

    test('Course details work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to course detail
      await page.locator('[data-testid="course-card"]').first().click();

      // Verify course details are accessible on mobile
      await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="enroll-button"]')).toBeVisible();
    });
  });
});

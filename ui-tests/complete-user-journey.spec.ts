import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('Complete student journey: browse, enroll, and pay for a course', async ({ page }) => {
    // Step 1: Student browses course list
    await page.goto('/');
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
    
    // Step 2: Student views course details
    const firstCourse = page.locator('[data-testid="course-card"]').first();
    const courseTitle = await firstCourse.locator('[data-testid="course-title"]').textContent();
    await firstCourse.click();
    
    // Verify course details page
    await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="teacher-profile"]')).toBeVisible();
    
    // Step 3: Student enrolls in course
    await page.locator('[data-testid="enroll-button"]').click();
    await expect(page.locator('[data-testid="enrollment-form"]')).toBeVisible();
    
    // Fill enrollment form
    await page.locator('[data-testid="student-name"]').fill('John Doe');
    await page.locator('[data-testid="student-email"]').fill('john.doe@example.com');
    await page.locator('[data-testid="student-phone"]').fill('+1234567890');
    await page.locator('[data-testid="submit-enrollment"]').click();
    
    // Step 4: Student completes payment
    await expect(page.locator('[data-testid="payment-screen"]')).toBeVisible();
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
    await page.locator('[data-testid="paid-button"]').click();
    
    // Step 5: Student sees success confirmation
    await expect(page.locator('[data-testid="success-dialog"]')).toBeVisible();
    await page.locator('[data-testid="success-ok-button"]').click();
    
    // Step 6: Student returns to home page
    await expect(page.url()).toMatch(/\/$|\/courses$/);
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
  });

  test('Complete teacher journey: login, create, manage, and delete course', async ({ page }) => {
    // Step 1: Teacher logs in
    await page.goto('/');
    await page.locator('[data-testid="teacher-login-link"]').click();
    await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="login-button"]').click();
    
    // Verify teacher dashboard
    await expect(page.locator('[data-testid="teacher-dashboard"]')).toBeVisible();
    
    // Step 2: Teacher creates a new course
    await page.locator('[data-testid="create-course-button"]').click();
    await expect(page.locator('[data-testid="create-course-form"]')).toBeVisible();
    
    const courseTitle = 'Test Course ' + Date.now();
    await page.locator('[data-testid="course-title-input"]').fill(courseTitle);
    await page.locator('[data-testid="course-description-input"]').fill('This is a test course created by automation');
    await page.locator('[data-testid="course-price-input"]').fill('149.99');
    await page.locator('[data-testid="course-category-select"]').selectOption('web-development');
    await page.locator('[data-testid="submit-course-button"]').click();
    
    // Verify course was created
    await expect(page.locator('[data-testid="course-created-success"]')).toBeVisible();
    
    // Step 3: Teacher views their courses
    await page.locator('[data-testid="my-courses-link"]').click();
    await expect(page.locator('[data-testid="my-courses-page"]')).toBeVisible();
    await expect(page.locator(`text=${courseTitle}`)).toBeVisible();
    
    // Step 4: Teacher searches for their course
    await page.locator('[data-testid="course-search-input"]').fill(courseTitle);
    await page.locator('[data-testid="course-search-input"]').press('Enter');
    await expect(page.locator(`text=${courseTitle}`)).toBeVisible();
    
    // Step 5: Teacher updates the course
    await page.locator('[data-testid="edit-course-button"]').first().click();
    await expect(page.locator('[data-testid="edit-course-form"]')).toBeVisible();
    
    const updatedTitle = courseTitle + ' - Updated';
    await page.locator('[data-testid="course-title-input"]').clear();
    await page.locator('[data-testid="course-title-input"]').fill(updatedTitle);
    await page.locator('[data-testid="update-course-button"]').click();
    
    // Verify course was updated
    await expect(page.locator('[data-testid="course-updated-success"]')).toBeVisible();
    
    // Step 6: Teacher disables the course
    await page.locator('[data-testid="disable-course-button"]').first().click();
    await expect(page.locator('[data-testid="disable-confirmation-dialog"]')).toBeVisible();
    await page.locator('[data-testid="confirm-disable-button"]').click();
    
    // Verify course is disabled
    await expect(page.locator('[data-testid="course-status"]').first()).toContainText('Disabled');
    
    // Step 7: Teacher deletes the course
    await page.locator('[data-testid="delete-course-button"]').first().click();
    await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).toBeVisible();
    await page.locator('[data-testid="confirm-delete-button"]').click();
    
    // Verify course was deleted
    await expect(page.locator('[data-testid="course-deleted-success"]')).toBeVisible();
    await expect(page.locator(`text=${updatedTitle}`)).not.toBeVisible();
  });

  test('Cross-functional test: Teacher creates course, student enrolls', async ({ page }) => {
    // Part 1: Teacher creates a course
    await page.goto('/');
    await page.locator('[data-testid="teacher-login-link"]').click();
    await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="login-button"]').click();
    
    // Create course
    await page.locator('[data-testid="create-course-button"]').click();
    const courseTitle = 'Automation Test Course ' + Date.now();
    await page.locator('[data-testid="course-title-input"]').fill(courseTitle);
    await page.locator('[data-testid="course-description-input"]').fill('Course created for automation testing');
    await page.locator('[data-testid="course-price-input"]').fill('99.99');
    await page.locator('[data-testid="course-category-select"]').selectOption('web-development');
    await page.locator('[data-testid="submit-course-button"]').click();
    await expect(page.locator('[data-testid="course-created-success"]')).toBeVisible();
    
    // Part 2: Student finds and enrolls in the course
    await page.goto('/');
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
    
    // Search for the course
    await page.locator('[data-testid="course-search-input"]').fill(courseTitle);
    await page.locator('[data-testid="course-search-input"]').press('Enter');
    
    // Click on the course
    await page.locator(`text=${courseTitle}`).click();
    await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
    
    // Enroll in the course
    await page.locator('[data-testid="enroll-button"]').click();
    await page.locator('[data-testid="student-name"]').fill('Test Student');
    await page.locator('[data-testid="student-email"]').fill('test.student@example.com');
    await page.locator('[data-testid="student-phone"]').fill('+1234567890');
    await page.locator('[data-testid="submit-enrollment"]').click();
    
    // Complete payment
    await page.locator('[data-testid="paid-button"]').click();
    await page.locator('[data-testid="success-ok-button"]').click();
    
    // Part 3: Teacher sees the enrollment
    await page.goto('/teacher/dashboard');
    await page.locator('[data-testid="my-courses-link"]').click();
    await page.locator(`text=${courseTitle}`).click();
    
    // Verify enrollment is visible
    await expect(page.locator('[data-testid="enrollment-list"]')).toBeVisible();
    await expect(page.locator('text=Test Student')).toBeVisible();
  });

  test('Error handling and edge cases', async ({ page }) => {
    // Test 1: Invalid course ID
    await page.goto('/course/invalid-id');
    await expect(page.locator('[data-testid="error-page"]')).toBeVisible();
    
    // Test 2: Invalid payment
    await page.goto('/payment/invalid-id');
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    
    // Test 3: Teacher access without login
    await page.goto('/teacher/dashboard');
    await expect(page.url()).toContain('/teacher/login');
    
    // Test 4: Invalid enrollment data
    await page.goto('/');
    await page.locator('[data-testid="course-card"]').first().click();
    await page.locator('[data-testid="enroll-button"]').click();
    await page.locator('[data-testid="submit-enrollment"]').click();
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
  });

  test('Responsive design across devices', async ({ page }) => {
    const devices = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const device of devices) {
      // Set viewport
      await page.setViewportSize({ width: device.width, height: device.height });
      
      // Test course list
      await page.goto('/');
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="course-card"]').first()).toBeVisible();
      
      // Test course details
      await page.locator('[data-testid="course-card"]').first().click();
      await expect(page.locator('[data-testid="course-detail-title"]')).toBeVisible();
      await expect(page.locator('[data-testid="enroll-button"]')).toBeVisible();
      
      // Test teacher login
      await page.goto('/');
      await page.locator('[data-testid="teacher-login-link"]').click();
      await expect(page.locator('[data-testid="teacher-login-page"]')).toBeVisible();
    }
  });

  test('Performance and load testing', async ({ page }) => {
    // Test page load time
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Test course list performance
    const courseCards = page.locator('[data-testid="course-card"]');
    const cardCount = await courseCards.count();
    
    // Should have at least one course
    expect(cardCount).toBeGreaterThan(0);
    
    // Test course details page load
    const detailStartTime = Date.now();
    await page.locator('[data-testid="course-card"]').first().click();
    await page.waitForLoadState('networkidle');
    const detailLoadTime = Date.now() - detailStartTime;
    
    // Course details should load within 3 seconds
    expect(detailLoadTime).toBeLessThan(3000);
  });
});

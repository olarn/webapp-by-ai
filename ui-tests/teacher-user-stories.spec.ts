import { test, expect } from '@playwright/test';

test.describe('Teacher User Stories', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the course platform homepage
    await page.goto('/');
  });

  test.describe('US1: Teacher Login', () => {
    test('As a teacher, I want to login to the web teacher area', async ({ page }) => {
      // Navigate to teacher login page
      await page.locator('[data-testid="teacher-login-link"]').click();
      
      // Verify teacher login page is displayed
      await expect(page.locator('[data-testid="teacher-login-page"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      
      // Verify login form elements
      await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    });

    test('Teacher can successfully login with valid credentials', async ({ page }) => {
      // Navigate to teacher login
      await page.locator('[data-testid="teacher-login-link"]').click();
      
      // Fill login form with valid credentials
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      
      // Submit login form
      await page.locator('[data-testid="login-button"]').click();
      
      // Verify successful login and redirect to teacher dashboard
      await expect(page.url()).toContain('/teacher/dashboard');
      await expect(page.locator('[data-testid="teacher-dashboard"]')).toBeVisible();
    });

    test('Teacher login shows error with invalid credentials', async ({ page }) => {
      // Navigate to teacher login
      await page.locator('[data-testid="teacher-login-link"]').click();
      
      // Fill login form with invalid credentials
      await page.locator('[data-testid="email-input"]').fill('invalid@example.com');
      await page.locator('[data-testid="password-input"]').fill('wrongpassword');
      
      // Submit login form
      await page.locator('[data-testid="login-button"]').click();
      
      // Verify error message is displayed
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
    });
  });

  test.describe('US2: Create Course', () => {
    test('As a teacher, I want to create course', async ({ page }) => {
      // Login as teacher first
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to create course page
      await page.locator('[data-testid="create-course-button"]').click();
      
      // Verify create course form is displayed
      await expect(page.locator('[data-testid="create-course-form"]')).toBeVisible();
      
      // Fill course information
      await page.locator('[data-testid="course-title-input"]').fill('Test Course');
      await page.locator('[data-testid="course-description-input"]').fill('This is a test course description');
      await page.locator('[data-testid="course-price-input"]').fill('99.99');
      await page.locator('[data-testid="course-category-select"]').selectOption('web-development');
      
      // Submit course creation form
      await page.locator('[data-testid="submit-course-button"]').click();
      
      // Verify course was created successfully
      await expect(page.locator('[data-testid="course-created-success"]')).toBeVisible();
      
      // Verify course appears in course list
      await page.locator('[data-testid="my-courses-link"]').click();
      await expect(page.locator('text=Test Course')).toBeVisible();
    });
  });

  test.describe('US3: View Course List', () => {
    test('As a teacher, I want to see list of my courses that I created', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Verify my courses page is displayed
      await expect(page.locator('[data-testid="my-courses-page"]')).toBeVisible();
      await expect(page.locator('[data-testid="my-courses-list"]')).toBeVisible();
      
      // Verify at least one course is displayed
      const courseCards = page.locator('[data-testid="my-course-card"]');
      await expect(courseCards.first()).toBeVisible();
      
      // Verify course information is displayed
      const firstCourse = courseCards.first();
      await expect(firstCourse.locator('[data-testid="course-title"]')).toBeVisible();
      await expect(firstCourse.locator('[data-testid="course-status"]')).toBeVisible();
    });
  });

  test.describe('US4: Search Courses', () => {
    test('As a teacher, I want to search my courses by entering keywords', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Find search input
      const searchInput = page.locator('[data-testid="course-search-input"]');
      await expect(searchInput).toBeVisible();
      
      // Search for a specific course
      await searchInput.fill('Test Course');
      await searchInput.press('Enter');
      
      // Verify search results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
      await expect(page.locator('text=Test Course')).toBeVisible();
      
      // Clear search and verify all courses are shown
      await searchInput.clear();
      await searchInput.press('Enter');
      await expect(page.locator('[data-testid="my-courses-list"]')).toBeVisible();
    });
  });

  test.describe('US5: Update Course', () => {
    test('As a teacher, I want to be able to update my courses that other teachers cannot see', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Click on edit button for first course
      await page.locator('[data-testid="edit-course-button"]').first().click();
      
      // Verify edit course form is displayed
      await expect(page.locator('[data-testid="edit-course-form"]')).toBeVisible();
      
      // Update course information
      await page.locator('[data-testid="course-title-input"]').clear();
      await page.locator('[data-testid="course-title-input"]').fill('Updated Test Course');
      await page.locator('[data-testid="course-description-input"]').clear();
      await page.locator('[data-testid="course-description-input"]').fill('This is an updated test course description');
      
      // Submit updated course
      await page.locator('[data-testid="update-course-button"]').click();
      
      // Verify course was updated successfully
      await expect(page.locator('[data-testid="course-updated-success"]')).toBeVisible();
      
      // Verify updated course appears in list
      await expect(page.locator('text=Updated Test Course')).toBeVisible();
    });
  });

  test.describe('US6: Disable Course', () => {
    test('As a teacher, I want to disable my courses so that the course I disabled will not show on public', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Find a course to disable
      const courseCard = page.locator('[data-testid="my-course-card"]').first();
      const courseTitle = await courseCard.locator('[data-testid="course-title"]').textContent();
      
      // Click disable button
      await courseCard.locator('[data-testid="disable-course-button"]').click();
      
      // Verify confirmation dialog
      await expect(page.locator('[data-testid="disable-confirmation-dialog"]')).toBeVisible();
      
      // Confirm disable action
      await page.locator('[data-testid="confirm-disable-button"]').click();
      
      // Verify course is disabled
      await expect(courseCard.locator('[data-testid="course-status"]')).toContainText('Disabled');
      
      // Verify course doesn't appear on public course list
      await page.goto('/');
      await expect(page.locator(`text=${courseTitle}`)).not.toBeVisible();
    });
  });

  test.describe('US7: Delete Course', () => {
    test('As a teacher, I want to be able to delete course', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Find a course to delete
      const courseCard = page.locator('[data-testid="my-course-card"]').first();
      const courseTitle = await courseCard.locator('[data-testid="course-title"]').textContent();
      
      // Click delete button
      await courseCard.locator('[data-testid="delete-course-button"]').click();
      
      // Verify confirmation dialog
      await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).toBeVisible();
      
      // Confirm delete action
      await page.locator('[data-testid="confirm-delete-button"]').click();
      
      // Verify course was deleted
      await expect(page.locator('[data-testid="course-deleted-success"]')).toBeVisible();
      
      // Verify course no longer appears in list
      await expect(page.locator(`text=${courseTitle}`)).not.toBeVisible();
    });
  });

  test.describe('Teacher Dashboard Features', () => {
    test('Teacher dashboard shows course statistics', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Verify dashboard statistics
      await expect(page.locator('[data-testid="total-courses"]')).toBeVisible();
      await expect(page.locator('[data-testid="active-courses"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-enrollments"]')).toBeVisible();
    });

    test('Teacher can view course analytics', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to analytics
      await page.locator('[data-testid="analytics-link"]').click();
      
      // Verify analytics page
      await expect(page.locator('[data-testid="analytics-page"]')).toBeVisible();
      await expect(page.locator('[data-testid="enrollment-chart"]')).toBeVisible();
    });
  });

  test.describe('Security and Access Control', () => {
    test('Teachers can only see their own courses', async ({ page }) => {
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Navigate to my courses
      await page.locator('[data-testid="my-courses-link"]').click();
      
      // Verify only teacher's courses are shown
      const courseCards = page.locator('[data-testid="my-course-card"]');
      const courseCount = await courseCards.count();
      
      // All courses should belong to the logged-in teacher
      for (let i = 0; i < courseCount; i++) {
        const courseCard = courseCards.nth(i);
        await expect(courseCard.locator('[data-testid="course-teacher"]')).toContainText('teacher@example.com');
      }
    });

    test('Non-authenticated users cannot access teacher area', async ({ page }) => {
      // Try to access teacher dashboard without login
      await page.goto('/teacher/dashboard');
      
      // Should be redirected to login page
      await expect(page.url()).toContain('/teacher/login');
      await expect(page.locator('[data-testid="teacher-login-page"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design for Teacher Interface', () => {
    test('Teacher dashboard works on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Login as teacher
      await page.locator('[data-testid="teacher-login-link"]').click();
      await page.locator('[data-testid="email-input"]').fill('teacher@example.com');
      await page.locator('[data-testid="password-input"]').fill('password123');
      await page.locator('[data-testid="login-button"]').click();
      
      // Verify dashboard is accessible on mobile
      await expect(page.locator('[data-testid="teacher-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="my-courses-link"]')).toBeVisible();
    });
  });
});

import { Page, APIRequestContext } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export interface TestCourse {
  title: string;
  description: string;
  price: number;
  category: string;
  teacherId: number;
}

export interface TestEnrollment {
  courseId: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

export class TestHelpers {
  private static readonly baseURL = 'http://localhost:3000';
  private static readonly frontendURL = 'http://localhost:5173';

  /**
   * Login as a teacher and return authentication token
   */
  static async loginAsTeacher(request: APIRequestContext, user: TestUser): Promise<string> {
    const response = await request.post(`${this.baseURL}/api/teachers/login`, {
      data: {
        email: user.email,
        password: user.password
      }
    });

    if (response.status() !== 200) {
      throw new Error(`Failed to login as teacher: ${response.status()}`);
    }

    const data = await response.json();
    return data.token || data.accessToken;
  }

  /**
   * Create a test course
   */
  static async createTestCourse(request: APIRequestContext, course: TestCourse, token?: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await request.post(`${this.baseURL}/api/courses`, {
      data: course,
      headers
    });

    if (response.status() !== 201) {
      throw new Error(`Failed to create course: ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Create a test enrollment
   */
  static async createTestEnrollment(request: APIRequestContext, enrollment: TestEnrollment): Promise<any> {
    const response = await request.post(`${this.baseURL}/api/enrollments`, {
      data: enrollment,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status() !== 201) {
      throw new Error(`Failed to create enrollment: ${response.status()}`);
    }

    return await response.json();
  }

  /**
   * Clean up test data
   */
  static async cleanupTestData(request: APIRequestContext, token?: string): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Clean up test courses
    try {
      await request.delete(`${this.baseURL}/api/courses/test-cleanup`, { headers });
    } catch (error) {
      // Ignore cleanup errors
    }

    // Clean up test enrollments
    try {
      await request.delete(`${this.baseURL}/api/enrollments/test-cleanup`, { headers });
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  /**
   * Wait for page to be ready
   */
  static async waitForPageReady(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Additional wait for any animations
  }

  /**
   * Navigate to course details page
   */
  static async navigateToCourseDetails(page: Page, courseId: number): Promise<void> {
    await page.goto(`${this.frontendURL}/course/${courseId}`);
    await this.waitForPageReady(page);
  }

  /**
   * Navigate to teacher dashboard
   */
  static async navigateToTeacherDashboard(page: Page): Promise<void> {
    await page.goto(`${this.frontendURL}/teacher/dashboard`);
    await this.waitForPageReady(page);
  }

  /**
   * Fill enrollment form
   */
  static async fillEnrollmentForm(page: Page, enrollment: TestEnrollment): Promise<void> {
    await page.getByLabel(/full name/i).fill(enrollment.studentName);
    await page.getByLabel(/email/i).fill(enrollment.studentEmail);
    await page.getByLabel(/phone/i).fill(enrollment.studentPhone);
  }

  /**
   * Submit enrollment form
   */
  static async submitEnrollmentForm(page: Page): Promise<void> {
    await page.getByRole('button', { name: /enroll/i }).click();
    await page.waitForTimeout(2000); // Wait for form submission
  }

  /**
   * Search for courses
   */
  static async searchCourses(page: Page, searchTerm: string): Promise<void> {
    const searchInput = page.getByPlaceholder(/search courses/i);
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
    await this.waitForPageReady(page);
  }

  /**
   * Filter courses by category
   */
  static async filterCoursesByCategory(page: Page, category: string): Promise<void> {
    await page.getByRole('button', { name: new RegExp(category, 'i') }).click();
    await this.waitForPageReady(page);
  }

  /**
   * Get course card by title
   */
  static async getCourseCardByTitle(page: Page, title: string) {
    return page.locator('[data-testid="course-card"]').filter({ hasText: title });
  }

  /**
   * Check if element is visible and clickable
   */
  static async isElementClickable(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return await element.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Generate random test data
   */
  static generateRandomTestData() {
    const timestamp = Date.now();
    return {
      user: {
        email: `test-${timestamp}@example.com`,
        password: 'testpassword123',
        name: `Test User ${timestamp}`
      },
      course: {
        title: `Test Course ${timestamp}`,
        description: `This is a test course created at ${timestamp}`,
        price: 99.99,
        category: 'web-development',
        teacherId: 1
      },
      enrollment: {
        courseId: 1,
        studentName: `Test Student ${timestamp}`,
        studentEmail: `student-${timestamp}@example.com`,
        studentPhone: `+1${timestamp.toString().slice(-10)}`
      }
    };
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Wait for API response
   */
  static async waitForAPIResponse(page: Page, urlPattern: string): Promise<any> {
    return new Promise((resolve) => {
      page.on('response', async (response) => {
        if (response.url().includes(urlPattern)) {
          const data = await response.json();
          resolve(data);
        }
      });
    });
  }

  /**
   * Login as teacher through UI
   */
  static async loginAsTeacherUI(page: Page, email: string = 'teacher@example.com', password: string = 'password123'): Promise<void> {
    await page.goto('/');
    await page.locator('[data-testid="teacher-login-link"]').click();
    await page.locator('[data-testid="email-input"]').fill(email);
    await page.locator('[data-testid="password-input"]').fill(password);
    await page.locator('[data-testid="login-button"]').click();
    await this.waitForPageReady(page);
  }

  /**
   * Create course through UI
   */
  static async createCourseUI(page: Page, courseData: Partial<TestCourse>): Promise<string> {
    await page.locator('[data-testid="create-course-button"]').click();
    await expect(page.locator('[data-testid="create-course-form"]')).toBeVisible();
    
    const title = courseData.title || `Test Course ${Date.now()}`;
    await page.locator('[data-testid="course-title-input"]').fill(title);
    await page.locator('[data-testid="course-description-input"]').fill(courseData.description || 'Test course description');
    await page.locator('[data-testid="course-price-input"]').fill(courseData.price?.toString() || '99.99');
    await page.locator('[data-testid="course-category-select"]').selectOption(courseData.category || 'web-development');
    await page.locator('[data-testid="submit-course-button"]').click();
    
    await expect(page.locator('[data-testid="course-created-success"]')).toBeVisible();
    return title;
  }

  /**
   * Enroll in course through UI
   */
  static async enrollInCourseUI(page: Page, studentData: Partial<TestEnrollment>): Promise<void> {
    await page.locator('[data-testid="enroll-button"]').click();
    await expect(page.locator('[data-testid="enrollment-form"]')).toBeVisible();
    
    await page.locator('[data-testid="student-name"]').fill(studentData.studentName || 'Test Student');
    await page.locator('[data-testid="student-email"]').fill(studentData.studentEmail || 'test@example.com');
    await page.locator('[data-testid="student-phone"]').fill(studentData.studentPhone || '+1234567890');
    await page.locator('[data-testid="submit-enrollment"]').click();
  }

  /**
   * Complete payment through UI
   */
  static async completePaymentUI(page: Page): Promise<void> {
    await expect(page.locator('[data-testid="payment-screen"]')).toBeVisible();
    await page.locator('[data-testid="paid-button"]').click();
    await expect(page.locator('[data-testid="success-dialog"]')).toBeVisible();
    await page.locator('[data-testid="success-ok-button"]').click();
  }
}

// Export default test data
export const defaultTestData = {
  teacher: {
    email: 'teacher@example.com',
    password: 'password123',
    name: 'Test Teacher'
  },
  student: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890'
  },
  course: {
    title: 'Vue.js Fundamentals',
    description: 'Learn Vue.js from scratch',
    price: 99.99,
    category: 'web-development',
    teacherId: 1
  }
};

import { Page, Locator, expect } from '@playwright/test';

export class CourseDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(courseId: number): Promise<void> {
    await this.page.goto(`/course/${courseId}`);
  }

  backButton(): Locator {
    return this.page.getByRole('button', { name: /back to courses/i });
  }

  title(): Locator {
    return this.page.locator('h1');
  }

  enrollNow(): Locator {
    return this.page.getByRole('button', { name: /enroll now/i });
  }

  aboutInstructorHeading(): Locator {
    return this.page.getByRole('heading', { name: /about the instructor/i });
  }

  // Enrollment modal
  enrollmentDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Course enrollment form' });
  }

  async fillEnrollmentForm({ firstName, lastName, email, phone }: { firstName: string; lastName: string; email: string; phone?: string }): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Student first name' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Student last name' }).fill(lastName);
    await this.page.getByRole('textbox', { name: 'Student email address' }).fill(email);
    if (phone) {
      await this.page.getByRole('textbox', { name: 'Student phone number' }).fill(phone);
    }
    await this.page.getByRole('checkbox', { name: 'Agree to terms and conditions' }).check();
  }

  async submitEnrollment(): Promise<void> {
    const submit = this.page.getByRole('button', { name: /proceed to payment/i });
    await submit.click();
  }

  // Payment screen
  paymentHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Payment', exact: true });
  }

  payButton(): Locator {
    return this.page.getByRole('button', { name: /pay \$/i });
  }

  successDialog(): Locator {
    return this.page.getByRole('heading', { name: 'Payment Successful!' });
  }

  continueToHome(): Locator {
    return this.page.getByRole('button', { name: /continue to home/i });
  }
}

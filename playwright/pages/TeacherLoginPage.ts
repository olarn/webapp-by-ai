import { Page, Locator, expect } from '@playwright/test';

export class TeacherLoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.form()).toBeVisible();
  }

  form(): Locator {
    return this.page.locator('[role="form"][aria-label="Teacher login credentials"]');
  }

  username(): Locator {
    return this.page.locator('[role="textbox"][aria-label="Teacher username"]');
  }

  password(): Locator {
    return this.page.locator('[role="textbox"][aria-label="Teacher password"]');
  }

  submit(): Locator {
    return this.page.locator('[role="button"][aria-label="Sign in to teacher account"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username().fill(username);
    await this.password().fill(password);
    await this.submit().click();
  }
}

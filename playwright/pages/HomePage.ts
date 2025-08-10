import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  main(): Locator {
    return this.page.locator('[role="main"][aria-label="Course Catalog"]');
  }

  banner(): Locator {
    return this.page.locator('[role="banner"]');
  }

  bannerHeading(): Locator {
    return this.page.locator('[role="banner"] h1');
  }

  searchSection(): Locator {
    return this.page.locator('[role="search"][aria-label="Search courses"]');
  }

  searchBox(): Locator {
    return this.page.locator('[role="searchbox"][aria-label="Search courses by title, instructor, or category"]');
  }

  async search(term: string): Promise<void> {
    const input = this.page.locator('[role="searchbox"]');
    await input.fill(term);
  }

  teacherLoginButton(): Locator {
    return this.page.locator('[role="button"][aria-label="Access teacher login page"]');
  }

  async clickTeacherLogin(): Promise<void> {
    await this.teacherLoginButton().click();
  }

  grid(): Locator {
    return this.page.locator('[role="grid"][aria-label="Available courses"]');
  }

  cells(): Locator {
    return this.page.locator('[role="gridcell"]');
  }

  async cellCount(): Promise<number> {
    return this.cells().count();
  }

  firstCell(): Locator {
    return this.cells().first();
  }

  firstCellTitle(): Locator {
    return this.firstCell().locator('h3');
  }

  firstCellPrice(): Locator {
    return this.firstCell().locator('[aria-label="Course price"]');
  }

  firstCellViewDetails(): Locator {
    return this.firstCell().locator('[role="button"][aria-label*="View details"]');
  }
}

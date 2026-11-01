import type { Locator, Page } from '@playwright/test';

export class Toast {
  private readonly toasts: Locator;

  constructor(page: Page) {
    this.toasts = page.locator('.oxd-toast');
  }

  message(text: string): Locator {
    return this.toasts.filter({ hasText: text });
  }
}

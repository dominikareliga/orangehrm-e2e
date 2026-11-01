import type { Page } from '@playwright/test';
import { LoginPage } from './login.page';

export class AuthDomain {
  private loginPage?: LoginPage;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get login(): LoginPage {
    return (this.loginPage ??= new LoginPage(this.page));
  }
}

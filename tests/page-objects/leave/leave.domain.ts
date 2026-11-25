import type { Page } from '@playwright/test';
import { LeaveListPage } from './leaveList.page';

export class LeaveDomain {
  private leaveListPage?: LeaveListPage;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get leaveList(): LeaveListPage {
    return (this.leaveListPage ??= new LeaveListPage(this.page));
  }
}

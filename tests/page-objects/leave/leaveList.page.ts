import type { Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { routes } from '../../routes';

export class LeaveListPage extends BasePage {
  readonly includePastEmployees = this.page
    .locator('.orangehrm-leave-filter', { hasText: 'Include Past Employees' })
    .getByRole('checkbox');
  readonly includePastEmployeesSwitch = this.page
    .locator('.orangehrm-leave-filter', { hasText: 'Include Past Employees' })
    .locator('.oxd-switch-input');
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  readonly rows = this.page.locator('.oxd-table-body').getByRole('row');

  async goto() {
    await this.page.goto(routes.leaveList);
  }

  requestRow(comment: string): Locator {
    return this.rows.filter({ hasText: comment });
  }

  async searchIncludingPastEmployees() {
    if (!(await this.includePastEmployees.isChecked())) {
      await this.includePastEmployeesSwitch.click();
    }
    await this.searchButton.click();
  }

  async approveRequest(comment: string) {
    await this.requestRow(comment).getByRole('button', { name: 'Approve' }).click();
  }
}

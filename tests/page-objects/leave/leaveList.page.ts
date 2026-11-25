import { BasePage } from '../base.page';
import { routes } from '../../routes';

export class LeaveListPage extends BasePage {
  readonly rows = this.page.locator('.oxd-table-body').getByRole('row');
  readonly firstRow = this.rows.first();
  readonly firstRowApproveButton = this.firstRow.getByRole('button', { name: 'Approve' });

  async goto() {
    await this.page.goto(routes.leaveList);
  }

  async approveFirstRow() {
    await this.firstRowApproveButton.click();
  }
}

import type { Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { routes } from '../../routes';

export class EmployeeListPage extends BasePage {
  readonly employeeNameGroup = this.page.locator('.oxd-input-group', { hasText: 'Employee Name' });
  readonly employeeNameField = this.employeeNameGroup.getByRole('textbox');
  readonly employeeIdGroup = this.page.locator('.oxd-input-group', { hasText: 'Employee Id' });
  readonly employeeIdField = this.employeeIdGroup.getByRole('textbox');
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  readonly rows = this.page.locator('.oxd-table-body').getByRole('row');
  readonly noRecordsMessage = this.page.locator('.orangehrm-paper-container').getByText('No Records Found');
  readonly deleteDialog = this.page.locator('.oxd-dialog-sheet');
  readonly confirmDeleteButton = this.deleteDialog.getByRole('button', { name: 'Yes, Delete' });

  row(employeeId: string): Locator {
    const idCell = this.page.getByRole('cell', { name: employeeId, exact: true });
    return this.rows.filter({ has: idCell });
  }

  async goto() {
    await this.page.goto(routes.employeeList);
  }

  async searchByName(name: string) {
    await this.employeeNameField.fill(name);

    // Typing alone doesn't filter: the search only uses the name once it's picked from the dropdown.
    const hint = this.employeeNameGroup.getByRole('option', { name, exact: true });
    await hint.click();

    await this.searchButton.click();
  }

  async searchById(employeeId: string) {
    await this.employeeIdField.fill(employeeId);
    await this.searchButton.click();
  }

  async openEmployee(employeeId: string) {
    await this.row(employeeId).click();
  }

  async deleteEmployee(employeeId: string) {
    const trashIcon = this.page.locator('.bi-trash');
    const deleteButton = this.row(employeeId).locator('button', { has: trashIcon });

    await deleteButton.click();
    await this.confirmDeleteButton.click();
  }
}

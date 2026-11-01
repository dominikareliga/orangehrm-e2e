import { BasePage } from '../base.page';
import { routes } from '../../routes';
import type { NewEmployee } from '../../test-data/employee';

export class AddEmployeePage extends BasePage {
  readonly firstNameField = this.page.getByRole('textbox', { name: 'First Name' });
  readonly lastNameField = this.page.getByRole('textbox', { name: 'Last Name' });
  readonly employeeIdField = this.page.locator('.oxd-input-group', { hasText: 'Employee Id' }).getByRole('textbox');
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly requiredErrors = this.page.getByText('Required', { exact: true });

  async goto() {
    await this.page.goto(routes.addEmployee);
  }

  async fill(employee: NewEmployee) {
    await this.firstNameField.fill(employee.firstName);
    await this.lastNameField.fill(employee.lastName);
    await this.employeeIdField.fill(employee.employeeId);
  }

  async save() {
    await this.saveButton.click();
  }
}

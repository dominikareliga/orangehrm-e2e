import { BasePage } from '../base.page';
import { routes } from '../../routes';

export class PersonalDetailsPage extends BasePage {
  readonly fullNameHeading = this.page.locator('.orangehrm-edit-employee-name').getByRole('heading');
  readonly personalDetailsForm = this.page.locator('form').filter({ hasText: 'Employee Full Name' });
  readonly employeeIdField = this.personalDetailsForm.locator('.oxd-input-group', { hasText: 'Employee Id' }).getByRole('textbox');
  readonly otherIdField = this.personalDetailsForm.locator('.oxd-input-group', { hasText: 'Other Id' }).getByRole('textbox');
  readonly driversLicenseField = this.personalDetailsForm.locator('.oxd-input-group', { hasText: "Driver's License Number" }).getByRole('textbox');
  readonly saveButton = this.personalDetailsForm.getByRole('button', { name: 'Save' });

  async goto(employeeNumber: number) {
    await this.page.goto(routes.personalDetails(employeeNumber));
  }

  async fill(identifiers: { otherId: string; driversLicense: string }) {
    await this.otherIdField.fill(identifiers.otherId);
    await this.driversLicenseField.fill(identifiers.driversLicense);
  }

  async save() {
    await this.saveButton.click();
  }
}

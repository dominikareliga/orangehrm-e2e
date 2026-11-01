import { test, expect } from '../../fixtures';
import { findEmployee } from '../../requests/employees.request';

test.describe('Create employee', { tag: '@pim' }, () => {
  test('Verify that an admin can create an employee', async ({ app, newEmployee }) => {
    await app.pim.addEmployee.goto();
    await app.pim.addEmployee.fill(newEmployee);
    await app.pim.addEmployee.save();

    await expect(app.toast.message('Successfully Saved')).toBeVisible();
    await expect(app.pim.personalDetails.fullNameHeading).toHaveText(`${newEmployee.firstName} ${newEmployee.lastName}`);
    await expect(app.pim.personalDetails.employeeIdField).toHaveValue(newEmployee.employeeId);
  });

  test('Verify that an employee cannot be saved without a first and last name', async ({ app, api, newEmployee }) => {
    await app.pim.addEmployee.goto();
    await app.pim.addEmployee.employeeIdField.fill(newEmployee.employeeId);
    await app.pim.addEmployee.save();

    await expect(app.pim.addEmployee.requiredErrors).toHaveCount(2);
    expect(await findEmployee(api, newEmployee.employeeId)).toBeNull();
  });
});

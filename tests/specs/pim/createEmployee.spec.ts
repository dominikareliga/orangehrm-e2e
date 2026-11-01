import { test, expect } from '../../fixtures';

test.describe('Create employee', { tag: '@pim' }, () => {
  test('Verify that an admin can create an employee', async ({ app, newEmployee }) => {
    await app.pim.addEmployee.goto();
    await app.pim.addEmployee.fill(newEmployee);
    await app.pim.addEmployee.save();

    await expect(app.toast.message('Successfully Saved')).toBeVisible();
    await expect(app.pim.personalDetails.fullNameHeading).toHaveText(`${newEmployee.firstName} ${newEmployee.lastName}`);
    await expect(app.pim.personalDetails.employeeIdField).toHaveValue(newEmployee.employeeId);
  });
});

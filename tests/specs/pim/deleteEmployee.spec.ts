import { test, expect } from '../../fixtures';

test('Verify that an admin can delete an employee from the list', { tag: '@pim' }, async ({ app, employee }) => {
  await app.pim.employeeList.goto();
  await app.pim.employeeList.searchById(employee.employeeId);
  await expect(app.pim.employeeList.row(employee.employeeId)).toBeVisible();

  await app.pim.employeeList.deleteEmployee(employee.employeeId);

  await expect(app.toast.message('Successfully Deleted')).toBeVisible();
  await expect(app.pim.employeeList.noRecordsMessage).toBeVisible();
});

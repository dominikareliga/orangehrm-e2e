import { test, expect } from '../../fixtures';

test('Verify that an admin can open employee details from the list', { tag: '@pim' }, async ({ app, employee }) => {
  await app.pim.employeeList.goto();
  await app.pim.employeeList.searchById(employee.employeeId);
  await app.pim.employeeList.openEmployee(employee.employeeId);

  await expect(app.pim.personalDetails.fullNameHeading).toHaveText(`${employee.firstName} ${employee.lastName}`);
  await expect(app.pim.personalDetails.employeeIdField).toHaveValue(employee.employeeId);
});

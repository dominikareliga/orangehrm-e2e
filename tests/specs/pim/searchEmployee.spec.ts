import { test, expect } from '../../fixtures';

test.describe('Search employee', { tag: '@pim' }, () => {
  test('Verify that searching by name returns only that employee', async ({ app, employee }) => {
    await app.pim.employeeList.goto();
    await app.pim.employeeList.searchByName(`${employee.firstName} ${employee.lastName}`);

    await expect(app.pim.employeeList.rows).toHaveCount(1);
    await expect(app.pim.employeeList.row(employee.employeeId)).toContainText(employee.firstName);
    await expect(app.pim.employeeList.row(employee.employeeId)).toContainText(employee.lastName);
  });

  test('Verify that searching by employee id returns only that employee', async ({ app, employee }) => {
    await app.pim.employeeList.goto();
    await app.pim.employeeList.searchById(employee.employeeId);

    await expect(app.pim.employeeList.rows).toHaveCount(1);
    await expect(app.pim.employeeList.row(employee.employeeId)).toContainText(employee.firstName);
    await expect(app.pim.employeeList.row(employee.employeeId)).toContainText(employee.lastName);
  });
});

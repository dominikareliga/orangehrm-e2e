import { test, expect } from '../../fixtures';

test('Verify that edited employee details are saved', { tag: '@pim' }, async ({ app, page, employee }) => {
  const identifiers = { otherId: `OID-${employee.employeeId}`, driversLicense: `DL-${employee.employeeId}` };

  await app.pim.personalDetails.goto(employee.employeeNumber);
  await expect(app.pim.personalDetails.employeeIdField).toHaveValue(employee.employeeId);

  await app.pim.personalDetails.fill(identifiers);
  await app.pim.personalDetails.save();
  await expect(app.toast.message('Successfully Updated')).toBeVisible();

  await page.reload();
  await expect(app.pim.personalDetails.otherIdField).toHaveValue(identifiers.otherId);
  await expect(app.pim.personalDetails.driversLicenseField).toHaveValue(identifiers.driversLicense);
});

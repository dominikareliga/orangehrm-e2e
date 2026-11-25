import { test, expect } from '../../fixtures';

test('Verify that an admin can approve the first leave request', { tag: '@leave' }, async ({ app }) => {
  await app.leave.leaveList.goto();
  await expect(app.leave.leaveList.firstRow).toBeVisible();
  await app.leave.leaveList.approveFirstRow();

  await expect(app.toast.message('Successfully Updated')).toBeVisible();
});

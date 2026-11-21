import { test, expect } from '../../fixtures';
import { cleanupPendingLeaveRequest, createPendingLeaveRequest } from '../../requests/leave.request';

test(
  'Verify that an admin can approve a leave request',
  { tag: '@leave' },
  async ({ app, api, browser, employee }) => {
    const leaveRequest = await createPendingLeaveRequest(api, browser, employee);
    try {
      await app.leave.leaveList.goto();
      await app.leave.leaveList.searchIncludingPastEmployees();
      await expect(app.leave.leaveList.requestRow(leaveRequest.comment)).toBeVisible();
      await app.leave.leaveList.approveRequest(leaveRequest.comment);

      await expect(app.toast.message('Successfully Updated')).toBeVisible();
    } finally {
      await cleanupPendingLeaveRequest(api, leaveRequest);
    }
  },
);

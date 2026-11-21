const APP = '/web/index.php';

export const routes = {
  login: `${APP}/auth/login`,
  dashboard: `${APP}/dashboard/index`,
  employeeList: `${APP}/pim/viewEmployeeList`,
  addEmployee: `${APP}/pim/addEmployee`,
  personalDetails: (employeeNumber: number) => `${APP}/pim/viewPersonalDetails/empNumber/${employeeNumber}`,
  employeesApi: `${APP}/api/v2/pim/employees`,
  usersApi: `${APP}/api/v2/admin/users`,
  leaveTypesApi: `${APP}/api/v2/leave/leave-types`,
  leaveRequestsApi: `${APP}/api/v2/leave/leave-requests`,
  leaveEntitlementsApi: `${APP}/api/v2/leave/leave-entitlements`,
  leavePeriodsApi: `${APP}/api/v2/leave/leave-periods`,
  leaveWorkweekApi: `${APP}/api/v2/leave/workweek`,
  leaveHolidaysApi: `${APP}/api/v2/leave/holidays`,
  leaveList: `${APP}/leave/viewLeaveList`,
};

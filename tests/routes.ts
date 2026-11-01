const APP = '/web/index.php';

export const routes = {
  login: `${APP}/auth/login`,
  dashboard: `${APP}/dashboard/index`,
  employeeList: `${APP}/pim/viewEmployeeList`,
  addEmployee: `${APP}/pim/addEmployee`,
  personalDetails: (employeeNumber: number) => `${APP}/pim/viewPersonalDetails/empNumber/${employeeNumber}`,
  employeesApi: `${APP}/api/v2/pim/employees`,
};

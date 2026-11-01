import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { App } from '../page-objects/app';
import { config } from '../config';
import { buildEmployee, type NewEmployee } from '../test-data/employee';
import { createEmployee, deleteEmployee, findEmployee, type Employee } from '../requests/employees.request';

type Fixtures = {
  app: App;
  api: APIRequestContext;
  employee: Employee;
  newEmployee: NewEmployee;
};

export const test = base.extend<Fixtures>({
  // Entry point to the page objects: app.pim.employeeList, app.toast, ...
  app: async ({ page }, use) => {
    await use(new App(page));
  },

  // Signed-in API client for creating and deleting test data without clicking through the UI.
  api: async ({ playwright, baseURL }, use) => {
    const api = await playwright.request.newContext({ baseURL, storageState: config.adminStorageState });
    await use(api);
    await api.dispose();
  },

  // A fresh employee created before the test and deleted after it, however the test ends.
  employee: async ({ api }, use) => {
    const employee = await createEmployee(api, buildEmployee());
    await use(employee);
    await deleteEmployee(api, employee.employeeNumber);
  },

  // Data for an employee the test creates itself through the UI; deleted after the test if it exists.
  newEmployee: async ({ api }, use) => {
    const employee = buildEmployee();
    await use(employee);
    const created = await findEmployee(api, employee.employeeId);
    if (created != null) {
      await deleteEmployee(api, created.employeeNumber);
    }
  },
});

export { expect };

import { expect, type APIRequestContext } from '@playwright/test';
import type { NewEmployee } from '../test-data/employee';
import { routes } from '../routes';

export type Employee = NewEmployee & { employeeNumber: number };

export async function createEmployee(api: APIRequestContext, employee: NewEmployee): Promise<Employee> {
  const response = await api.post(routes.employeesApi, { data: { ...employee, middleName: '' } });
  await expect(response).toBeOK();

  const { data } = await response.json();
  return { ...employee, employeeNumber: data.empNumber };
}

export async function findEmployee(api: APIRequestContext, employeeId: string): Promise<Employee | null> {
  const response = await api.get(routes.employeesApi, { params: { employeeId } });
  await expect(response).toBeOK();

  const { data: employees } = await response.json();
  if (employees.length === 0) {
    return null;
  }

  const [employee] = employees;
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    employeeId: employee.employeeId,
    employeeNumber: employee.empNumber,
  };
}

export async function deleteEmployee(api: APIRequestContext, employeeNumber: number) {
  const response = await api.delete(routes.employeesApi, { data: { ids: [employeeNumber] } });

  // 404 means it is already gone, which is fine for cleanup.
  if (response.status() === 404) {
    return;
  }

  await expect(response).toBeOK();
}

import { randomUUID } from 'node:crypto';
import { expect, type APIRequestContext, type Browser, type BrowserContext } from '@playwright/test';
import { config } from '../config';
import type { Employee } from './employees.request';
import { LoginPage } from '../page-objects/auth/login.page';
import { routes } from '../routes';

type LeaveRequestData = {
  leaveRequestId: number;
  entitlementId: number;
  userId: number;
  comment: string;
  employeeContext: BrowserContext;
};

async function findUpcomingWorkingDate(api: APIRequestContext, endDate: string): Promise<string> {
  const workweekResponse = await api.get(routes.leaveWorkweekApi);
  await expect(workweekResponse).toBeOK();
  const { data: workweek } = (await workweekResponse.json()) as { data: Record<string, number> };

  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + 1);
  const lastDay = new Date(`${endDate}T00:00:00.000Z`);

  while (date <= lastDay) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();
    if (workweek[weekday] === 0) {
      const dateString = date.toISOString().slice(0, 10);
      const holidaysResponse = await api.get(routes.leaveHolidaysApi, {
        params: { fromDate: dateString, toDate: dateString },
      });
      await expect(holidaysResponse).toBeOK();
      const { data: holidays } = await holidaysResponse.json();
      if (holidays.length === 0) {
        return dateString;
      }
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }

  throw new Error(`No upcoming working day is available before ${endDate}`);
}

export async function createPendingLeaveRequest(
  api: APIRequestContext,
  browser: Browser,
  employee: Employee,
): Promise<LeaveRequestData> {
  let userId: number | undefined;
  let entitlementId: number | undefined;
  let leaveRequestId: number | undefined;
  let employeeContext: BrowserContext | undefined;

  try {
    const [periodsResponse, typesResponse] = await Promise.all([
      api.get(routes.leavePeriodsApi),
      api.get(routes.leaveTypesApi),
    ]);
    await expect(periodsResponse).toBeOK();
    await expect(typesResponse).toBeOK();

    const { meta: periodMetadata } = await periodsResponse.json();
    const leavePeriod = periodMetadata.currentLeavePeriod;
    if (!leavePeriod) {
      throw new Error('The current leave period is not defined');
    }

    const { data: leaveTypes } = await typesResponse.json();
    const leaveType = leaveTypes.find((type: { id: number; deleted: boolean }) => type.id === 1 && !type.deleted);
    if (!leaveType) {
      throw new Error('US Vacation leave type is not available');
    }

    const username = `pw${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const password = `Test-${randomUUID()}!`;
    const userResponse = await api.post(routes.usersApi, {
      data: {
        username,
        password,
        status: true,
        userRoleId: 2,
        empNumber: employee.employeeNumber,
      },
    });
    await expect(userResponse).toBeOK();
    const { data: user } = await userResponse.json();
    if (typeof user.id !== 'number') {
      throw new Error('Creating the ESS user did not return a user ID');
    }
    userId = user.id;

    const entitlementResponse = await api.post(routes.leaveEntitlementsApi, {
      data: {
        empNumber: employee.employeeNumber,
        leaveTypeId: leaveType.id,
        fromDate: leavePeriod.startDate,
        toDate: leavePeriod.endDate,
        entitlement: 1,
      },
    });
    await expect(entitlementResponse).toBeOK();
    const { data: entitlement } = await entitlementResponse.json();
    if (typeof entitlement.id !== 'number') {
      throw new Error('Creating the leave entitlement did not return an entitlement ID');
    }
    entitlementId = entitlement.id;

    employeeContext = await browser.newContext({
      baseURL: config.baseUrl,
      storageState: { cookies: [], origins: [] },
    });
    const employeePage = await employeeContext.newPage();
    const login = new LoginPage(employeePage);
    await login.goto();
    await expect(login.usernameField).toBeVisible({ timeout: 30_000 });
    await login.signIn(username, password);
    await expect(employeePage).toHaveURL(routes.dashboard, { timeout: 30_000 });

    const requestDate = await findUpcomingWorkingDate(api, leavePeriod.endDate);
    const comment = `Playwright leave approval ${randomUUID().slice(0, 12)}`;
    const leaveRequestResponse = await employeeContext.request.post(routes.leaveRequestsApi, {
      data: {
        leaveTypeId: leaveType.id,
        fromDate: requestDate,
        toDate: requestDate,
        comment,
        duration: { type: 'full_day' },
      },
    });
    await expect(leaveRequestResponse).toBeOK();
    const { data: leaveRequest } = await leaveRequestResponse.json();
    if (typeof leaveRequest.id !== 'number') {
      throw new Error('Creating the leave request did not return a request ID');
    }
    leaveRequestId = leaveRequest.id;

    if (userId === undefined || entitlementId === undefined || leaveRequestId === undefined) {
      throw new Error('The leave request setup did not return all required IDs');
    }

    return {
      leaveRequestId,
      entitlementId,
      userId,
      comment,
      employeeContext,
    };
  } catch (error) {
    if (leaveRequestId && employeeContext) {
      const cancelResponse = await employeeContext.request.put(
        `${routes.leaveRequestsApi}/${leaveRequestId}`,
        { data: { action: 'CANCEL' } },
      );
      await expect(cancelResponse).toBeOK();
    }
    if (employeeContext) {
      await employeeContext.close();
    }
    if (entitlementId) {
      const cleanupResponse = await api.delete(routes.leaveEntitlementsApi, {
        data: { ids: [entitlementId] },
      });
      await expect(cleanupResponse).toBeOK();
    }
    if (userId) {
      const cleanupResponse = await api.delete(routes.usersApi, { data: { ids: [userId] } });
      await expect(cleanupResponse).toBeOK();
    }
    throw error;
  }
}

export async function cleanupPendingLeaveRequest(api: APIRequestContext, leaveRequest: LeaveRequestData) {
  const cancelResponse = await leaveRequest.employeeContext.request.put(
    `${routes.leaveRequestsApi}/${leaveRequest.leaveRequestId}`,
    { data: { action: 'CANCEL' } },
  );
  await expect(cancelResponse).toBeOK();

  await leaveRequest.employeeContext.close();

  const entitlementResponse = await api.delete(routes.leaveEntitlementsApi, {
    data: { ids: [leaveRequest.entitlementId] },
  });
  await expect(entitlementResponse).toBeOK();

  const userResponse = await api.delete(routes.usersApi, {
    data: { ids: [leaveRequest.userId] },
  });
  await expect(userResponse).toBeOK();
}

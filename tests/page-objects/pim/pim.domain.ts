import type { Page } from '@playwright/test';
import { AddEmployeePage } from './addEmployee.page';
import { EmployeeListPage } from './employeeList.page';
import { PersonalDetailsPage } from './personalDetails.page';

export class PimDomain {
  private employeeListPage?: EmployeeListPage;
  private addEmployeePage?: AddEmployeePage;
  private personalDetailsPage?: PersonalDetailsPage;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get employeeList(): EmployeeListPage {
    return (this.employeeListPage ??= new EmployeeListPage(this.page));
  }

  get addEmployee(): AddEmployeePage {
    return (this.addEmployeePage ??= new AddEmployeePage(this.page));
  }

  get personalDetails(): PersonalDetailsPage {
    return (this.personalDetailsPage ??= new PersonalDetailsPage(this.page));
  }
}

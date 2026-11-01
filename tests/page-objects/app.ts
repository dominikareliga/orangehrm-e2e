import type { Page } from '@playwright/test';
import { AuthDomain } from './auth/auth.domain';
import { PimDomain } from './pim/pim.domain';
import { Toast } from './components/toast.component';

// Single entry point to all page objects, e.g. app.pim.employeeList.
export class App {
  private authDomain?: AuthDomain;
  private pimDomain?: PimDomain;
  private toastComponent?: Toast;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get auth(): AuthDomain {
    return (this.authDomain ??= new AuthDomain(this.page));
  }

  get pim(): PimDomain {
    return (this.pimDomain ??= new PimDomain(this.page));
  }

  get toast(): Toast {
    return (this.toastComponent ??= new Toast(this.page));
  }
}

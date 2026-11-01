import { BasePage } from '../base.page';
import { routes } from '../../routes';

export class LoginPage extends BasePage {
  readonly usernameField = this.page.getByRole('textbox', { name: 'Username' });
  readonly passwordField = this.page.getByRole('textbox', { name: 'Password' });
  readonly loginButton = this.page.getByRole('button', { name: 'Login' });

  async goto() {
    await this.page.goto(routes.login);
  }

  async signIn(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}

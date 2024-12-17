import type { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/login");
  }

  async fillForm(email: string, password: string) {
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
  }

  async submit() {
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}

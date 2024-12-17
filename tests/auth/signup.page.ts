import type { Page } from "@playwright/test";

export class SignUpPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async fillForm(
    username: string,
    email: string,
    password: string,
    confirm: string
  ) {
    await this.page.locator("#username").fill(username);
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
    await this.page.locator("#confirm").fill(confirm);
  }

  async submit() {
    await this.page.getByRole("button", { name: "Sign Up" }).click();
  }
}

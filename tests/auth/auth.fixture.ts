import prisma from "@/lib/db/db";
import { LoginPage } from "@/tests/auth/login.page";
import { faker } from "@faker-js/faker";
import { test as base, expect } from "@playwright/test";
import { User } from "lucide-react";
import { SignUpPage } from "./signup.page";

type User = {
  username: string;
  email: string;
  password: string;
};

type AuthFixtures = {
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  credential: User;
  account: User;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(loginPage);
  },
  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(signUpPage);
  },
  credential: async ({}, use) => {
    const user = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(user);

    await prisma.user.deleteMany({
      where: {
        email: user.email,
      },
    });
  },
  account: async ({ browser, credential }, use) => {
    const page = await browser.newPage();
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();
    await signUpPage.fillForm(
      credential.username,
      credential.email,
      credential.password,
      credential.password
    );
    await signUpPage.submit();
    await page.waitForURL("/verify-email");

    const row = await prisma.user.findUnique({
      where: {
        email: credential.email,
      },
      include: {
        emailVerificationRequests: true,
      },
    });

    const code = row?.emailVerificationRequests?.[0].code;
    await expect(code).toHaveLength(8);
    await page.getByRole("textbox").fill(code!);
    await expect(page).toHaveURL("/home");
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/login");
    await page.close();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(credential);
  },
});

export { expect } from "@playwright/test";

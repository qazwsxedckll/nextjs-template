import prisma from "@/lib/db/db";
import { expect, test } from "@/tests/auth/auth.fixture";

test("redirect unauthorized user to the login page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});

test("switch between login and signup", async ({ page }) => {
  await page.goto("login");
  await page.getByRole("link", { name: "Sign Up" }).click();
  await expect(page).toHaveURL("/signup");
  await page.getByRole("link", { name: "Login" }).click();
  await expect(page).toHaveURL("/login");
});

test.describe("login", () => {
  test("warn if input is incorrect", async ({ page, loginPage }) => {
    await loginPage.fillForm("incorrect", "pass");
    await loginPage.submit();
    await expect(page.getByText("Please enter a valid email.")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 8 characters.")
    ).toBeVisible();
  });

  test("login is incorrect", async ({ page, loginPage }) => {
    await loginPage.fillForm("incorrect@email.com", "password@1");
    await loginPage.submit();
    await expect(page.getByText("Invaild email or password")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue("incorrect@email.com");
  });

  test("successful", async ({ page, loginPage, account }) => {
    await loginPage.fillForm(account.email, account.password);
    await loginPage.submit();
    await expect(page).toHaveURL("/home");
  });
});

test.describe("sign up", () => {
  test("warn if input is incorrect", async ({ page, signUpPage }) => {
    await signUpPage.fillForm("a", "incorrect", "pass", "passw");
    await signUpPage.submit();
    await expect(
      page.getByText("Username must be at least 2 characters long.")
    ).toBeVisible();
    await expect(page.getByText("Please enter a valid email.")).toBeVisible();
    await expect(page.getByText("Password must:")).toBeVisible();
    await expect(page.getByText("Passwords do not match.")).toBeVisible();
  });

  test("successful", async ({ page, signUpPage, credential }) => {
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
  });

  test("warn if email is already in use", async ({
    page,
    signUpPage,
    account,
  }) => {
    await signUpPage.fillForm(
      account.username,
      account.email,
      account.password,
      account.password
    );
    await signUpPage.submit();
    await expect(page.getByText("Email is already in use.")).toBeVisible();
  });
});

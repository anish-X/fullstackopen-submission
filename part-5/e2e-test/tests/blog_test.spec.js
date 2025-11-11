const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./../helper.js");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    // ...
    await request.post("http://localhost:5000/api/testing/reset");
    await request.post("http://localhost:5000/api/user", {
      data: {
        name: "blogName",
        username: "blogUsername",
        password: "blogpass",
      },
    });

    await page.goto("http://localhost:5173/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText(/Login in to application/i)).toBeVisible();
    // Use label locators for form inputs
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    // Use role locator for submit button
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "blogUsername", "blogpass");

      await expect(page.getByText("blogName logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "blogUsername", "wrongpass");
      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "blogUsername", "blogpass");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "test", "testauthor", "test.com");
      // Wait for notification to confirm blog was created
      await expect(page.getByText("test testauthor")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "test", "testauthor", "test.com");
      await page.getByRole("button", { name: "show" }).click();
      await expect(page.getByText("likes 0")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("a user can delete their own blog", async ({ page }) => {
      // login & create
      await createBlog(page, "testblog", "testauthor", "test.com");

      await expect(page.getByText("testblog testauthor")).toBeVisible();

      const blogToDelete = page
        .locator(".blog")
        .filter({ hasText: "testblog" });
      await blogToDelete.getByRole("button", { name: "show" }).click();

      // handle confirm before click
      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Remove blog testblog");
        await dialog.accept();
      });

      // remove
      await blogToDelete.getByRole("button", { name: /remove/i }).click();

      // verify it’s gone
      await expect(page.getByText("testblog testauthor")).not.toBeVisible();
    });

    test("only creator can see delete button", async ({ page, request }) => {
      await page.getByRole("button", { name: /logout/i }).click();

      await request.post("http://localhost:5000/api/testing/reset");

      await request.post("http://localhost:5000/api/user", {
        data: {
          name: "user",
          username: "user_1",
          password: "pass1",
        },
      });

      await request.post("http://localhost:5000/api/user", {
        data: {
          name: "user",
          username: "user_2",
          password: "pass2",
        },
      });

      await loginWith(page, "user_1", "pass1");
      await createBlog(page, "testblog1", "testauthor1", "testlink1");

      await page.getByRole("button", { name: /logout/i }).click();

      await loginWith(page, "user_2", "pass2");
      await page.getByRole("button", { name: "show" }).click();

      await createBlog(page, "testblog2", "testauthor2", "testlink2");

      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test("blogs are ordered by likes", async ({ page }) => {
      await createBlog(page, "testblog", "testauthor", "testlink");
      await createBlog(page, "testblog2", "testauthor2", "testlink2");
      await createBlog(page, "testblog3", "testauthor3", "testlink3");

      const secondBlog = page.locator(".blog").filter({ hasText: "testblog2" });
      await secondBlog.getByRole("button", { name: "show" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("likes 1")).toBeVisible();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("likes 2")).toBeVisible();

      const thirdBlog = page.locator(".blog").filter({ hasText: "testblog3" });
      await thirdBlog.getByRole("button", { name: "show" }).click();
      await thirdBlog.getByRole("button", { name: "like" }).click();
      await expect(thirdBlog.getByText("likes 1")).toBeVisible();

      const blogs = await page.locator(".blog").allTextContents();
      expect(blogs[0]).toContain("testblog2");
      expect(blogs[1]).toContain("testblog3");
      expect(blogs[2]).toContain("testblog");
    });
  });
});

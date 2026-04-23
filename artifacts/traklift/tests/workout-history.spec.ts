import { expect, type Page, test } from "@playwright/test";

async function enterOnboardingDetails(page: Page, name: string) {
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();

  await page.getByLabel("Your Name").fill(name);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("I accept the Terms of Service").click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("I accept the Privacy Policy").click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("I accept the use of Local Storage").click();

  await expect(page.getByText(`Ready to lift, ${name}?`)).toBeVisible();
}

async function completeOnboarding(page: Page, name = "History Tester") {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Track your lifts without the clutter." })).toBeVisible();
  await page.getByRole("button", { name: "Start with your name" }).click();
  await enterOnboardingDetails(page, name);
}

async function saveBenchPressLift(page: Page, date: string, weight: string) {
  await page.getByText("Bench Press").click();
  await expect(page.getByRole("heading", { name: "Bench Press" })).toBeVisible();

  await page.getByLabel("Date").fill(date);
  await page.getByLabel("Weight").fill(weight);
  await page.getByRole("button", { name: "Save Lift" }).click();

  await expect(page.getByRole("heading", { name: "Lift Saved" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("completes onboarding, saves a lift, and shows it in history", async ({ page }) => {
  await completeOnboarding(page);
  await saveBenchPressLift(page, "2026-01-02", "150");

  await page.getByRole("button", { name: "View History" }).click();

  await expect(page.getByRole("heading", { name: "Bench Press" })).toBeVisible();
  await expect(page.getByText("Jan 2, 2026")).toBeVisible();
  await expect(page.getByText("150")).toBeVisible();
  await expect(page.getByText("lbs").first()).toBeVisible();
});

test("landing page links to the name-entry screen", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Track your lifts without the clutter." })).toBeVisible();
  await page.getByRole("button", { name: "Start with your name" }).click();

  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  await expect(page.getByText("What should we call you?")).toBeVisible();
  await expect(page.getByLabel("Your Name")).toBeVisible();
});

test("returning users can open the tracker from the landing page", async ({ page }) => {
  await completeOnboarding(page, "Returning Tester");

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Track your lifts without the clutter." })).toBeVisible();
  await page.getByRole("button", { name: "Open my tracker" }).click();

  await expect(page.getByText("Ready to lift, Returning Tester?")).toBeVisible();
  await expect(page.getByText("Bench Press")).toBeVisible();
});

test("progress reads the same saved lift data", async ({ page }) => {
  await completeOnboarding(page, "Progress Tester");
  await saveBenchPressLift(page, "2026-01-02", "150");
  await page.getByRole("button", { name: "Track Another Lift" }).click();
  await saveBenchPressLift(page, "2026-01-09", "160");

  await page.goto("/chart/bench-press");

  await expect(page.getByText("Progress", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Progress data" })).toContainText("Jan 2, 2026: 150 lbs");
  await expect(page.getByRole("region", { name: "Progress data" })).toContainText("Jan 9, 2026: 160 lbs");
});

test("changing name keeps saved workout history", async ({ page }) => {
  await completeOnboarding(page, "Original Tester");
  await saveBenchPressLift(page, "2026-01-02", "150");

  await page.getByRole("button", { name: "Track Another Lift" }).click();
  await page.getByRole("button", { name: "Change name" }).click();
  await enterOnboardingDetails(page, "Renamed Tester");
  await expect(page.getByText("Ready to lift, Renamed Tester?")).toBeVisible();

  await page.goto("/entries/bench-press");

  await expect(page.getByRole("heading", { name: "Bench Press" })).toBeVisible();
  await expect(page.getByText("Jan 2, 2026")).toBeVisible();
  await expect(page.getByText("150")).toBeVisible();
});
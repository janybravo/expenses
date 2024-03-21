import { test, expect } from "@playwright/test"

test.describe("App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("Should render correctly first ", async ({ page }) => {
    await expect(page.getByRole("figure")).toHaveScreenshot({ maxDiffPixelRatio: 0.15 })
  })

  test("Should skip summing Jan/1.", async ({ page }) => {
    const figure = page.getByRole("figure")
    await figure.getByText(/^1$/g).click()
    await page.getByRole("menu").getByText("Skip").click()
    await expect(figure.getByText("0.0K")).toBeVisible()
  })
})

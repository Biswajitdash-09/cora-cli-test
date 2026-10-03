import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("renders the main content and anchor navigation", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    await expect(page).toHaveTitle("Apple (India)");
    await expect(page.getByRole("heading", { level: 1, name: "iPhone 16 Pro" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "MacBook Air" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Apple Watch Series 10" })).toBeVisible();

    if (testInfo.project.name === "desktop-chromium") {
      await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Mac" }).click();
    } else {
      const menuButton = page.getByRole("button", { name: /navigation menu/i });
      const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });

      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#mobile-navigation")).toHaveAttribute("aria-hidden", "false");
      await mobileNav.getByRole("link", { name: "Mac" }).click();
    }
    await expect(page).toHaveURL(/#hero-1$/);
    await expect(page.locator("#hero-1")).toBeInViewport();

    if (testInfo.project.name === "desktop-chromium") {
      await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Trade In" }).click();
    } else {
      const menuButton = page.getByRole("button", { name: /navigation menu/i });
      const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });

      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#mobile-navigation")).toHaveAttribute("aria-hidden", "false");
      await mobileNav.getByRole("link", { name: "Trade In" }).click();
    }
    await expect(page).toHaveURL(/#promos$/);
    await expect(page.locator("#promos")).toBeInViewport();

    if (testInfo.project.name === "desktop-chromium") {
      await page.getByRole("link", { name: "See offers" }).first().click();
    } else {
      await page.getByRole("link", { name: "See offers" }).first().click();
    }
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("shows keyboard focus styles on interactive elements", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    if (testInfo.project.name !== "desktop-chromium") {
      await page.getByRole("button", { name: /navigation menu/i }).focus();
      await expect(page.getByRole("button", { name: /navigation menu/i })).toBeFocused();

      const outlineStyle = await page.getByRole("button", { name: /navigation menu/i }).evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
          outlineStyle: styles.outlineStyle,
          outlineWidth: styles.outlineWidth,
        };
      });

      expect(outlineStyle.outlineStyle).not.toBe("none");
      expect(outlineStyle.outlineWidth).not.toBe("0px");
      return;
    }

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Apple home" })).toBeFocused();

    const outlineStyle = await page.getByRole("link", { name: "Apple home" }).evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
      };
    });

    expect(outlineStyle.outlineStyle).not.toBe("none");
    expect(outlineStyle.outlineWidth).not.toBe("0px");
  });

  test("uses the stacked responsive layouts", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    const heroColumns = await page.locator("#hero-0").evaluate((element) => window.getComputedStyle(element).gridTemplateColumns);
    const promoColumns = await page
      .locator(".promo-grid__cards")
      .evaluate((element) => window.getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length);
    const footerColumns = await page
      .locator(".footer__grid")
      .evaluate((element) => window.getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length);

    if (testInfo.project.name === "desktop-chromium") {
      expect(heroColumns.split(" ").filter(Boolean).length).toBe(2);
      expect(promoColumns).toBe(2);
      expect(footerColumns).toBe(4);
    }

    if (testInfo.project.name === "tablet-chromium") {
      expect(heroColumns.split(" ").filter(Boolean).length).toBe(1);
      expect(promoColumns).toBe(2);
      expect(footerColumns).toBe(2);
    }

    if (testInfo.project.name === "mobile-chromium") {
      expect(heroColumns.split(" ").filter(Boolean).length).toBe(1);
      expect(promoColumns).toBe(1);
      expect(footerColumns).toBe(1);
    }
  });

  test("opens and closes the mobile menu accessibly", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium", "Mobile nav behavior is only relevant on the mobile viewport.");

    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    const menuButton = page.getByRole("button", { name: /navigation menu/i });
    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });

    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("aria-hidden", "true");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("aria-hidden", "false");

    await mobileNav.getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.getByRole("button", { name: /navigation menu/i })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("aria-hidden", "true");
  });

  test("renders products and updates the cart", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();
    await expect(page.getByRole("list", { name: "Product catalog" }).getByText("iPhone 16 Pro")).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "0 items" })).toBeVisible();

    await page.locator("#store").scrollIntoViewIfNeeded();
    await page.locator(".storefront__toolbar").getByRole("button", { name: "Mac" }).click();
    await expect(page.locator(".storefront__results")).toContainText("Showing 1 product in Mac.");
    await expect(page.getByRole("list", { name: "Product catalog" }).getByText("MacBook Air 15-inch")).toBeVisible();
    await expect(page.locator(".storefront__catalog .product-card")).toHaveCount(1);
    await expect(page.locator(".storefront__catalog .product-card").filter({ hasText: "iPhone 16 Pro" })).toHaveCount(0);

    await page.locator(".storefront__toolbar").getByRole("button", { name: "All" }).click();
    await expect(page.getByText("Showing 6 products across the full lineup.")).toBeVisible();
    await expect(page.getByText("Your bag is empty. Add a product to review India pricing and checkout options.")).toBeVisible();
    await expect(page.getByText("Checkout becomes available after you add at least one product.")).toBeVisible();

    await page.locator("#store").scrollIntoViewIfNeeded();
    await page.locator(".product-card", { hasText: "iPhone 16 Pro" }).getByRole("button", { name: "Add to bag" }).click();
    await page.locator(".product-card", { hasText: "Apple Watch Series 10" }).getByRole("button", { name: "Add and review" }).click();

    await expect(page.locator(".cart-panel").getByRole("heading", { level: 3, name: "2 items" })).toBeVisible();
    await expect(page.locator(".cart-panel").getByText("2 items ready. Subtotal ₹1,66,800.")).toBeVisible();
    await expect(page.locator(".cart-panel").getByText("Ready to continue with your current bag.")).toBeVisible();
    await expect(page.getByText("iPhone 16 Pro")).toBeVisible();
    await expect(page.getByText("Apple Watch Series 10")).toBeVisible();
    await expect(page.getByRole("link", { name: "Checkout" })).toBeEnabled();
  });

  test("applies and removes a coupon at checkout", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    await page.locator("#store").scrollIntoViewIfNeeded();
    await page.locator(".product-card", { hasText: "iPhone 16 Pro" }).getByRole("button", { name: "Add to bag" }).click();
    await page.locator(".cart-panel").getByRole("link", { name: "Checkout" }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await page.getByLabel("Promo code").fill("student");
    await page.getByRole("button", { name: "Apply coupon" }).click();

    await expect(page.getByText("Coupon applied. ₹5,000 in savings is now included.")).toBeVisible();
    await expect(page.getByText("Coupon").locator("..")).toContainText("STUDENT");
    await expect(page.getByText("Coupon savings").locator("..")).toContainText("-₹5,000");
    await expect(page.getByText("Total").locator("..")).toContainText("₹1,62,452");

    await page.getByRole("button", { name: "Remove coupon" }).click();
    await expect(page.getByText("Coupon removed. Order total updated.")).toBeVisible();
    await expect(page.getByText("Coupon savings")).toHaveCount(0);
    await expect(page.getByText("Total").locator("..")).toContainText("₹1,67,452");
  });

  test("navigates to checkout and places a demo order", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();

    await page.locator("#store").scrollIntoViewIfNeeded();
    await page.locator(".product-card", { hasText: "iPhone 16 Pro" }).getByRole("button", { name: "Add to bag" }).click();
    await expect(page.locator(".cart-panel")).toContainText("1 item");
    await expect(page.locator(".cart-panel").getByRole("link", { name: "Checkout" })).toBeVisible();
    await page.locator(".cart-panel").getByRole("link", { name: "Checkout" }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByRole("heading", { level: 1, name: "Review your bag and complete your order." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Bag summary" })).toBeVisible();
    await expect(page.getByText("iPhone 16 Pro")).toBeVisible();
    await expect(page.getByText("Estimated tax")).toBeVisible();

    await page.getByLabel("Promo code").fill("NOEMI");
    await page.getByRole("button", { name: "Apply coupon" }).click();
    await expect(page.getByText("Coupon applied. No Cost EMI details are now highlighted in your order summary.")).toBeVisible();
    await expect(page.getByText("No Cost EMI offer available at checkout with eligible cards.")).toBeVisible();

    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page.getByText("Email is required.")).toBeVisible();
    await expect(page.getByText("Full name is required.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Postal code")).toHaveAttribute("aria-invalid", "true");

    await page.getByLabel("Email").fill("demo@example.com");
    await page.getByLabel("Full name").fill("Demo User");
    await page.getByLabel("Street address").fill("1 Infinite Loop");
    await page.getByLabel("City").fill("Cupertino");
    await page.getByLabel("Postal code").fill("95014");
    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page.getByText("Enter a valid 6-digit postal code.")).toBeVisible();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.getByLabel("Postal code").fill("560001");
    await page.getByLabel("Apple Store pickup").check();

    await page.getByRole("button", { name: "Place demo order" }).click();
    await expect(page).toHaveURL(/\/thank-you\?/);
    await expect(page.getByRole("heading", { level: 1, name: "Thanks for your order." })).toBeVisible();
    await expect(page.getByText("Order confirmed")).toBeVisible();
    await expect(page.getByText("Apple Store pickup")).toBeVisible();
    await expect(page.getByText("Demo User")).toBeVisible();
    await expect(page.getByText("demo@example.com")).toBeVisible();
    await expect(page.getByText("1 Infinite Loop, Cupertino 95014")).toBeVisible();
  });

  test("does not fail key page requests", async ({ page, baseURL }) => {
    const failedResponses: string[] = [];

    page.on("response", (response) => {
      if (response.status() < 400) {
        return;
      }

      const url = response.url();
      const homeUrl = baseURL ? `${baseURL}/` : null;

      if (url.includes("/_next") || url.includes("/__nextjs_font") || url === homeUrl) {
        failedResponses.push(`${response.status()} ${url}`);
      }
    });

    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Shop the latest lineup in India." })).toBeVisible();
    expect(failedResponses).toEqual([]);
  });
});

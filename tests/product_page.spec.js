import { test, expect } from "@playwright/test"

//skipping as will only work on desktop setup
test.skip("Product Page Add To Basket", async ({ page }) => {
    await page.goto("/")
    
    //Create variables to use
    const addToBasketButton = page.locator('[data-qa="product-button"]').first()
    const basketCounter = page.locator('[data-qa="header-basket-count"]')

    //Verify basket counter is 0 and 'Add to Basket' button is present
    await addToBasketButton.waitFor()
    await expect(addToBasketButton).toHaveText("Add to Basket")
    await expect(basketCounter).toHaveText("0")

    //Click button and verify basket counter is now 1 and button text updated
    await addToBasketButton.click()
    await expect(addToBasketButton).toHaveText("Remove from Basket")
    await expect(basketCounter).toHaveText("1")

    //Click checkout link and assert URL has updated
    const checkoutLink = page.getByRole('link', { name: 'Checkout' })
    await checkoutLink.waitFor()
    await checkoutLink.click()
    await page.waitForURL("/basket")
});
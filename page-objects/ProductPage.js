import { expect } from "@playwright/test"
import { Navigation } from "./Navigation"
import { isDesktopViewport } from "../utils/isDesktopViewport"

export class ProductPage {
    constructor(page) {
        this.page = page

        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitle = page.locator('[data-qa="product-title"]')
    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor()
        await expect(specificAddButton).toHaveText("Add to Basket")

        const navigation = new Navigation(this.page)
        //only on desktop viewport
        let basketCountBeforeAdding
        //console.log(basketCountBeforeAdding)
        if (isDesktopViewport(this.page)) {
           basketCountBeforeAdding = await navigation.getBasketCount()
           console.log(basketCountBeforeAdding)             
        }
                
        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        //only on desktop viewport
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }

    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        // get order of products
        await this.productTitle.first()
        const productTitlesBeforeSorting = await this.productTitle.allInnerTexts()
        await this.sortDropdown.selectOption('price-asc')
        //get order of products again & assert difference
        const productTitlesAfterSorting = await this.productTitle.allInnerTexts()
        expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting)
    }
}

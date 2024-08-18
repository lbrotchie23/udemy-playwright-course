import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page
                            .frameLocator('[data-qa="active-discount-container"]')
                            .locator('[data-qa="discount-code"]')

        //new element for the discount input
        this.discountInputField = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalWithDiscountValue = page.locator('[data-qa="total-with-discount-value"]')
        this.totalCost = page.locator('[data-qa="total-value"]')

        this.ccOwnerInput = page.getByPlaceholder('Credit card owner')
        this.ccNumberInput = page.getByPlaceholder('Credit card number')
        this.ccValidUntilInput = page.getByPlaceholder('Valid until')
        this.ccCVCInput = page.getByPlaceholder('Credit card CVC')

        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInputField.waitFor()
        //Option 1 for laggy inputs using .fill() with await expect()
        // need to fill out the discount input
        await this.discountInputField.fill(code)
        // wait to see that the input contains the value which was entered
        await expect(this.discountInputField).toHaveValue(code)

        /*
        //Option 2 for laggy inputs: slow typing
        await this.discountInputField.focus()
        await this.page.keyboard.type(code, {delay:1000})
        expect(await this.discountInputField.inputValue()).toBe(code)
        */

        await this.activateDiscountButton.waitFor()
        await expect(this.discountActiveMessage).not.toBeVisible()
        await this.activateDiscountButton.click()
        //check that discount activate message returned
        await expect(this.discountActiveMessage).toBeVisible()
        //check that discounted price total showing
        await expect(this.totalWithDiscountValue).toBeVisible()
        //check that the discounted price total is smaller than the regular one
        const originalCost = await this.totalCost.innerText()
        const cleanOriginalCostString = originalCost.replace("$", "")
        const cleanOriginalCostNumber = parseInt(cleanOriginalCostString, 10)
        const discountValue = await this.totalWithDiscountValue.innerText()
        const cleanDiscountedCostString = discountValue.replace("$", "")
        const cleanDiscountedCostNumber = parseInt(cleanDiscountedCostString, 10)
        expect(cleanDiscountedCostNumber).toBeLessThan(cleanOriginalCostNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.ccOwnerInput.waitFor()
        await this.ccOwnerInput.fill(paymentDetails.owner)
        await this.ccNumberInput.waitFor()
        await this.ccNumberInput.fill(paymentDetails.ccnumber)
        await this.ccValidUntilInput.waitFor()
        await this.ccValidUntilInput.fill(paymentDetails.validUntil)
        await this.ccCVCInput.waitFor()
        await this.ccCVCInput.fill(paymentDetails.cvc)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, {timeout: 3000})
    }
}
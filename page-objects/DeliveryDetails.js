import { expect } from "@playwright/test"

export class DeliveryDetails {
    constructor(page) {
        this.page = page

        this.firstNameField = page.getByPlaceholder('First name')
        this.lastNameField = page.getByPlaceholder('Last name')
        this.streetField = page.getByPlaceholder('Street')
        this.postCodeField = page.getByPlaceholder('Post code')
        this.cityField = page.getByPlaceholder('City')
        this.comboboxField = page.getByRole('combobox')
        this.saveAddressButton = page.getByRole('button', { name: 'Save address for next time' })
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]')
        this.savedAddressFirstName = page.locator('[data-qa="saved-address-firstName"]')
        this.savedAddressLastName = page.locator('[data-qa="saved-address-lastName"]')
        this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]')
        this.savedAddressPostcode = page.locator('[data-qa="saved-address-postcode"]')
        this.savedAddressCity = page.locator('[data-qa="saved-address-city"]')
        this.savedAddressCountry = page.locator('[data-qa="saved-address-country"]')
        this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' })

    }

    fillDetails = async (userAddress) => {
        await this.firstNameField.waitFor()
        await this.firstNameField.fill(userAddress.firstName)
        await this.lastNameField.waitFor()
        await this.lastNameField.fill(userAddress.lastName)
        await this.streetField.waitFor()
        await this.streetField.fill(userAddress.street)
        await this.postCodeField.waitFor()
        await this.postCodeField.fill(userAddress.postcode)
        await this.cityField.waitFor()
        await this.cityField.fill(userAddress.city)
        await this.comboboxField.waitFor()
        await this.comboboxField.selectOption(userAddress.country)
    }

    saveDetails = async () => {
        const addressCountBeforeSaving = await this.savedAddressContainer.count()
        console.log("Address count is..." + addressCountBeforeSaving)
        await this.saveAddressButton.waitFor()
        await this.saveAddressButton.click()
        await this.savedAddressContainer.waitFor()
        const addressCountAfterSaving = await this.savedAddressContainer.count()
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1)
        console.log("Address count is..." + addressCountAfterSaving)

        await this.savedAddressFirstName.first().waitFor()
        expect( await this.savedAddressFirstName.first().innerText()).toBe(await this.firstNameField.inputValue())

        await this.savedAddressLastName.first().waitFor()
        expect( await this.savedAddressLastName.first().innerText()).toBe(await this.lastNameField.inputValue())

        await this.savedAddressStreet.first().waitFor()
        expect( await this.savedAddressStreet.first().innerText()).toBe(await this.streetField.inputValue())

        await this.savedAddressPostcode.first().waitFor()
        expect( await this.savedAddressPostcode.first().innerText()).toBe(await this.postCodeField.inputValue())

        await this.savedAddressCity.first().waitFor()
        expect( await this.savedAddressCity.first().innerText()).toBe(await this.cityField.inputValue())

        await this.savedAddressCountry.first().waitFor()
        expect( await this.savedAddressCountry.first().innerText()).toBe(await this.comboboxField.inputValue())

    }

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor()
        await this.continueToPaymentButton.click()
        await this.page.waitForURL(/\/payment/, { timeout: 3000 })
    }
}
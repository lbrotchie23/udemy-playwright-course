export class LoginPage {
    constructor(page) {
        this.page = page

        this.continueToRegistrationButton = page.locator('[data-qa="go-to-signup-button"]')        
    }

    moveToSignup = async () => {
        await this.continueToRegistrationButton.waitFor()
        await this.continueToRegistrationButton.click()
        await this.page.waitForURL(/\/signup/, {timeout: 3000})
    }
}
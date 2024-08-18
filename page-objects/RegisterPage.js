export class RegisterPage {
    constructor(page) {
        this.page = page

        this.emailInput = page.getByPlaceholder('E-Mail')
        this.passwordInput = page.getByPlaceholder('password')
        this.registerButton = page.getByRole('button', { name: 'Register' })
    }

    signUpAsNewUser = async (email, password) => {
        //type into email input
        await this.emailInput.waitFor()
        await this.emailInput.fill(email)
        await this.passwordInput.waitFor()
        await this.passwordInput.fill(password)
        //click register button
        await this.registerButton.waitFor()
        await this.registerButton.click()
    }
}
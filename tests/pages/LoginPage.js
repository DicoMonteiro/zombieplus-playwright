const { expect } = require('@playwright/test');

export class LoginPage {

    constructor(page) {
        this.page = page
    }

    async visit(){
        await this.page.goto('/admin/login');
    }

    async submitLoginForm(dataTest) {
        await this.page.getByPlaceholder('E-mail').fill(dataTest.email)
        await this.page.getByPlaceholder('Senha').fill(dataTest.pass)
        await this.page.getByRole('button', { name: 'Entrar' }).click()
    }

    async alertHaveText(message) {
        const alert = await this.page.locator('span[class$=alert]')
        await expect(alert).toHaveText(message);
    }

}
const { expect } = require('@playwright/test');

export class Login {

    constructor(page) {
        this.page = page
    }

    async loggedIn(user, dataTest) {
        await this.visit()
        await this.submitLoginForm(dataTest)
        await this.validateDashboard(user)
    }

    async visit(){
        await this.page.goto('/admin/login');
    }

    async validateDashboard(user) {
        const welcome = await this.page.locator('.logged-user small')
        await expect(welcome).toHaveText(`Olá, ${user}`);
        // await this.page.waitForLoadState('networkidle')
        // await expect(this.page).toHaveURL('/admin/movies')
        // const dashboardLogo = this.page.locator('img[alt=Logo]')
        // const logout = this.page.locator('a[href="/logout"]')
        // await expect(dashboardLogo).toBeVisible()
        // await expect(logout).toBeVisible()
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
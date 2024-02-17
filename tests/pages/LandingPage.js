const { expect } = require('@playwright/test');

export class LandingPage {

    constructor(page) {
        this.page = page
    }

    async visit(){
        await this.page.goto('/');
    }

    async accessAdmin() {
        await this.page.locator('a[href="/admin"]').click()
        const loginForm = this.page.locator('.login-form img[alt=Logo]')
        await expect(loginForm).toBeVisible()
    }

    async openLeadModal(text) {
        await this.page.getByRole('button', { name: /Aperte o play/ }).click()
        await expect(
            this.page.getByTestId('modal').getByRole('heading')
        ).toHaveText(text)
        await expect(
            this.page.locator(`//h2[text()="${text}"]/../div/p`)
        ).toHaveText('Faça o pré-cadastro e receba uma oferta especial na semana do lançamento.');

    }

    async submitLeadForm(dataTest) {
        await this.page.getByPlaceholder('Informe seu nome').fill(dataTest.name)
        await this.page.getByPlaceholder('Informe seu email').fill(dataTest.email)
        await this.page.getByTestId('modal').getByText('Quero entrar na fila!').click()
    }

    // async clearFields() {
    //     await this.page.getByPlaceholder('Informe seu nome').clear();
    //     await this.page.getByPlaceholder('Informe seu email').clear();
    // }

    async validateAlert(message) {
        const alert = await this.page.locator('.alert')
        await expect(alert).toHaveText(message);
    }
}
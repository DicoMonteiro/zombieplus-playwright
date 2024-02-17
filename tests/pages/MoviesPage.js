const { expect } = require('@playwright/test');

export class MoviesPage {

    constructor(page) {
        this.page = page
    }

    async validateDashboard() {
        await this.page.waitForLoadState('networkidle')
        await expect(this.page).toHaveURL('/admin/movies')
        const dashboardLogo = this.page.locator('img[alt=Logo]')
        const logout = this.page.locator('a[href="/logout"]')
        await expect(dashboardLogo).toBeVisible()
        await expect(logout).toBeVisible()
    }

    async create(title, overview, company, release_year) {
        await this.page.locator('a[href$=register] svg').click()
        await this.page.getByLabel('Titulo do filme').fill(title)
        await this.page.getByLabel('Sinopse').fill(overview)
        await this.page.locator('label[for=select_company_id] div[id=select_company_id]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: company })
            .click()
        await this.page.locator('label[for=select_year] div[id=select_year]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: release_year })
            .click()
    }

    async submit() {
        //await this.page.locator('//button[text()="Cadastrar"]').click()
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }
}
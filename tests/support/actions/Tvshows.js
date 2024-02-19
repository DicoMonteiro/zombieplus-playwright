const { expect } = require('@playwright/test');

export class Tvshows {

    constructor(page) {
        this.page = page
    }

    async goToTvShows() {
        await this.page.locator('a[href$=tvshows]').click()
    }

    async goForm() {
        await this.page.locator('a[href$=register]').click()
    }

    async create(tvshow) {
        await this.page.getByLabel('Titulo da série').fill(tvshow.title)
        await this.page.getByLabel('Sinopse').fill(tvshow.overview)
        await this.page.locator('label[for=select_company_id] div[id=select_company_id]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.company })
            .click()
        await this.page.locator('label[for=select_year] div[id=select_year]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.release_year })
            .click()
        await this.page.getByLabel('Temporadas').fill(`${tvshow.season}`)

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + tvshow.cover)

        if (tvshow.featured == true) {
            await this.page.locator('.featured .react-switch').click()
        }
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async deleteTvshow(tvshowName) {
        await this.page.getByRole('row', { name: tvshowName }).getByRole('button').click()
        await this.page.locator('.confirm-removal').click()
    }

    async searchTvshow(tvshowName) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(tvshowName)
        await this.page.locator('.actions form button').click()
    }

    async validateFields(message) {
        const alert = await this.page.locator('.alert')
        await expect(alert).toHaveText(message);
    }

    async validateTvshowInList(tvshowName) {
        const movie = await this.page.getByRole('row', { name: tvshowName })
        await expect(movie).toBeVisible()
    }

    async validadeTvshowNotFound() {
        const message = await this.page.locator('span')
        await expect(message).toHaveText('Nenhum registro encontrado!')
    }
}
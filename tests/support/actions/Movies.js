const { expect } = require('@playwright/test');

export class Movies {

    constructor(page) {
        this.page = page
    }

    async goForm() {
        await this.page.locator('a[href$=register]').click()
    }

    async create(movie) {
        await this.page.getByLabel('Titulo do filme').fill(movie.title)
        await this.page.getByLabel('Sinopse').fill(movie.overview)
        await this.page.locator('label[for=select_company_id] div[id=select_company_id]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.company })
            .click()
        await this.page.locator('label[for=select_year] div[id=select_year]')
            .click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: movie.release_year })
            .click()
        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + movie.cover)

        if (movie.featured == true) {
            await this.page.locator('.featured .react-switch').click()
        }
    }

    async submit() {
        //await this.page.locator('//button[text()="Cadastrar"]').click()
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async deleteMovie(movieName) {
        await this.page.getByRole('row', { name: movieName }).getByRole('button').click()
        await this.page.locator('.confirm-removal').click()
    }

    async searchMovie(movieName) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(movieName)
        await this.page.locator('.actions form button').click()
    }

    async validateFields(message) {
        // switch (field) {
        //     case 'title':
        //         const title = this.page.locator('.alert').filter({ hasText: message })
        //         await expect(title).toBeVisible()
        //         break;
        //     case 'overview':
        //         const overview = this.page.locator('.alert').filter({ hasText: message })
        //         await expect(overview).toBeVisible()
        //         break;
        //     case 'company':
        //         const company = this.page.locator('.alert').filter({ hasText: message })
        //         await expect(company).toBeVisible()
        //         break;
        //     case 'release_year':
        //         const release_year = this.page.locator('.alert').filter({ hasText: message })
        //         await expect(release_year).toBeVisible()
        //         break;
        // }
        const alert = await this.page.locator('.alert')
        await expect(alert).toHaveText(message);
    }

    async validateMovieInList(movieName) {
        const movie = await this.page.getByRole('row', { name: movieName })
        await expect(movie).toBeVisible()
    }

    async validateMoviesList(movies) {
        const rows = await this.page.getByRole('row')
        await expect(rows).toContainText(movies.outputs)
    }

    async validadeMovieNotFound() {
        const message = await this.page.locator('span')
        await expect(message).toHaveText('Nenhum registro encontrado!')
    }
}
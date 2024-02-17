const { test } = require('../support');

const dataMovies = require('../support/fixtures/movies.json')
const db = require('../support/database')

test('deve poder cadastrar um novo filme', async ({ page }) => {

    // Excluindo o filme antes de cadastra-lo
    const movie = dataMovies.create
    await db.executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    // Dado que já estou logado como administrador
    await page.loginPage.visit()
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.loginPage.submitLoginForm(dataTest)
    await page.moviesPage.validateDashboard()

    // Quando solicito o cadastro de um novo filme
    await page.moviesPage.create(movie.title, movie.overview, movie.company, movie.release_year)
    await page.moviesPage.submit()

    // Então visualizo uma mensagem de sucesso
    await page.toast.containText('Cadastro realizado com sucesso!')
})

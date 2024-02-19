const { test, expect } = require('../support');

const dataMovies = require('../support/fixtures/movies.json')
const db = require('../support/database')

test.beforeAll(async () => {
    await db.executeSQL(`DELETE FROM movies;`)
})

test('deve poder cadastrar um novo filme', async ({ page }) => {

    const movie = dataMovies.create

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de um novo filme
    await page.movies.goForm()
    await page.movies.create(movie)
    await page.movies.submit()

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)

})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de um novo filme sem preencher os campos obrigatórios
    await page.movies.goForm()
    await page.movies.submit()

    // Então visualizo uma mensagem de insucesso
    await page.movies.validateFields(['Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório', 'Campo obrigatório'])
})

test('não deve poder cadastrar um filme duplicado', async ({ page, request }) => {
    const movie = dataMovies.duplicate

    await request.api.postMovie(movie)

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de um novo filme já cadastrado
    await page.movies.goForm()
    await page.movies.create(movie)
    await page.movies.submit()

    // Então visualizo uma mensagem de insucesso
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

})

test('deve poder cadastrar um novo filme como destaque', async ({ page }) => {

    const movie = dataMovies.highlight

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de um novo filme
    await page.movies.goForm()
    await page.movies.create(movie)
    await page.movies.submit()

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)

})

test('deve poder excluir um filme cadastrado', async ({ page, request }) => {
    const movie = dataMovies.delete

    await request.api.postMovie(movie)

    // Dado que já estou logado como administrador e já tenho um filme cadastrado
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito a excluão do filme cadastrado
    await page.movies.deleteMovie(movie.title)

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText('Filme removido com sucesso.')

})

test('deve poder buscar um filme cadastrado', async ({ page, request }) => {
    const movie = dataMovies.search

    await request.api.postMovie(movie)

    // Dado que já estou logado como administrador e já tenho um filme cadastrado
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito a busca por um filme cadastrado
    await page.movies.searchMovie(movie.title)

    // Então visualizo o filme na lista de filmes
    await page.movies.validateMovieInList(movie.title)

})

test('deve poder realizar busca pelo termo zumbi', async ({ page, request }) => {
    const movies = dataMovies.search_term

    movies.data.forEach(async (movie) => {
        await request.api.postMovie(movie)
    })

    // Dado que já estou logado como administrador e já tenho filmes cadastrados
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito uma busca por um termo dos filmes cadastrados
    await page.movies.searchMovie(movies.input)

    // Então visualizo os filmes na lista de filmes pelo termo
    // movies.data.forEach(async (movie) => {
    //     await page.movies.validateMovieInList(movie.title)
    // })
    await page.movies.validateMoviesList(movies)

})

test('não deve retornar nenhum registo ao busca por um termo inexistente', async ({ page, request }) => {

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito uma busca por um termo que não existe
    await page.movies.searchMovie('Teste QAx')

    // Então visualizo uma mensagem de alerta
    await page.movies.validadeMovieNotFound()

})
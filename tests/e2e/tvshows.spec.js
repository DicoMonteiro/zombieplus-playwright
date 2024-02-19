const { test, expect } = require('../support');

const dataTvshows = require('../support/fixtures/tvshows.json')
const db = require('../support/database')

test.beforeAll(async () => {
    await db.executeSQL(`DELETE FROM tvshows;`)
})

test('deve poder cadastrar uma nova serie', async ({ page }) => {

    const tvshow = dataTvshows.create

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de uma nova serie
    await page.tvshows.goToTvShows()
    await page.tvshows.goForm()
    await page.tvshows.create(tvshow)
    await page.tvshows.submit()

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)

})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de uma nova serie sem preencher os campos obrigatórios
    await page.tvshows.goToTvShows()
    await page.tvshows.goForm()
    await page.tvshows.submit()

    // Então visualizo uma mensagem de insucesso
    await page.tvshows.validateFields([
            'Campo obrigatório', 
            'Campo obrigatório', 
            'Campo obrigatório', 
            'Campo obrigatório',
            'Campo obrigatório (apenas números)'
        ])
})

test('não deve cadastrar quando preenchido o campo temporadas com valor diferente de números', async ({ page }) => {
    const tvshow =  {
        "title": "The Walking Zombi",
        "overview": "Um grupo de sobreviventes é constantemente desafiado a manter sua humanidade enquanto vive entre um apocalipse zumbi.",
        "company": "Fox Entertainment",
        "release_year": 2010,
        "featured": true,
        "season": 'testes',
        "cover": "/covers/tvshows/twd.png"
    }
    
    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de uma nova serie sem preencher os campos obrigatórios
    await page.tvshows.goToTvShows()
    await page.tvshows.goForm()
    await page.tvshows.create(tvshow)
    await page.tvshows.submit()

    // Então visualizo uma mensagem de insucesso
    await page.tvshows.validateFields('Campo obrigatório (apenas números)')
})

test('não deve poder cadastrar uma serie duplicada', async ({ page, request }) => {
    const tvshow = dataTvshows.duplicate

    await request.api.postTvshow(tvshow)

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de uma nova serie já cadastrada
    await page.tvshows.goToTvShows()
    await page.tvshows.goForm()
    await page.tvshows.create(tvshow)
    await page.tvshows.submit()

    // Então visualizo uma mensagem de insucesso
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

})

test('deve poder cadastrar uma nova serie como destaque', async ({ page }) => {

    const tvshow = dataTvshows.highlight

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito o cadastro de uma nova serie como destaque
    await page.tvshows.goToTvShows()
    await page.tvshows.goForm()
    await page.tvshows.create(tvshow)
    await page.tvshows.submit()

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)

})

test('deve poder excluir uma serie cadastrada', async ({ page, request }) => {
    const tvshow = dataTvshows.to_remove

    await request.api.postTvshow(tvshow)

    // Dado que já estou logado como administrador e já tenho uma serie cadastrada
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito a excluão da serie cadastrada
    await page.tvshows.goToTvShows()
    await page.tvshows.deleteTvshow(tvshow.title)

    // Então visualizo uma mensagem de sucesso
    await page.popup.haveText('Série removida com sucesso.')

})

test('deve poder buscar uma serie cadastrada', async ({ page, request }) => {
    const tvshow = dataTvshows.search

    await request.api.postTvshow(tvshow)

    // Dado que já estou logado como administrador e já tenho uma serie cadastrada
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito a busca por uma serie cadastrada
    await page.tvshows.goToTvShows()
    await page.tvshows.searchTvshow(tvshow.title)

    // Então visualizo o filme na lista de series
    await page.tvshows.validateTvshowInList(tvshow.title)

})

test('deve poder realizar busca pelo termo zombie', async ({ page, request }) => {
    const tvshows = dataTvshows.search_term

    tvshows.data.forEach(async (tvshow) => {
        await request.api.postTvshow(tvshow)
    })

    // Dado que já estou logado como administrador e já tenha series cadastradas
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito uma busca por um termo das series cadastradas
    await page.tvshows.goToTvShows()
    await page.tvshows.searchTvshow(tvshows.input)

    // Então visualizo os filmes na lista de séries pelo termo
    tvshows.data.forEach(async (tvshow) => {
        await page.tvshows.validateTvshowInList(tvshow.title)
    })
})

test('não deve retornar nenhum registo ao busca por um termo inexistente', async ({ page, request }) => {

    // Dado que já estou logado como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.loggedIn('Admin', dataTest)

    // Quando solicito uma busca por um termo que não existe
    await page.tvshows.goToTvShows()
    await page.tvshows.searchTvshow('Teste QAx')

    // Então visualizo uma mensagem de alerta
    await page.tvshows.validadeTvshowNotFound()

})
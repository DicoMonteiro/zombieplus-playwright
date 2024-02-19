const { test } = require('../support');

test('deve logar como administrador', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login como administrador
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "pwd123"
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo o dashboard
    await page.login.validateDashboard('Admin')
})

test('não deve logar quando o email inválido', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login sem preencher o email
    const dataTest = {
        email: "admin.com",
        pass: "pwd123"
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    await page.login.alertHaveText('Email incorreto')
})

test('não deve logar com email incorreto', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login com email incorreto
    const dataTest = {
        email: "admin@test.com",
        pass: "pwd123"
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    const expectedMessage = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.popup.haveText(expectedMessage)
})

test('não deve logar com senha incorreta', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login com senha incorreta
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: "test123"
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    const expectedMessage = 'Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.popup.haveText(expectedMessage)
})

test('não deve logar quando o email não é preenchido', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login sem preencher o email
    const dataTest = {
        email: "",
        pass: "pwd123"
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    await page.login.alertHaveText('Campo obrigatório')
})

test('não deve logar quando a senha não é preenchida', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login sem preencher a senha
    const dataTest = {
        email: "admin@zombieplus.com",
        pass: ""
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    await page.login.alertHaveText('Campo obrigatório')
})

test('não deve logar quando os campos não foram preenchidos', async ({ page }) => {

    // Dado que já estou na tela de login
    await page.login.visit()

    // Quando realizo o login sem preencher os campos
    const dataTest = {
        email: "",
        pass: ""
    }
    await page.login.submitLoginForm(dataTest)
    
    // Então visualizo uma mensagem de alerta
    await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})
const { test, expect } = require('../support');

const { faker } = require('@faker-js/faker');


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }
  await page.landingPage.submitLeadForm(dataTest)
  
  // Devo visualizar uma mensagem de sucesso
  const expectedMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await page.toast.containText(expectedMessage)

});

test('não deve cadastrar quando o email já existe', async ( { page, request } ) => {
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: dataTest.name,
      email: dataTest.email
    }
  })

  expect(newLead.ok()).toBeTruthy()

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro de um email já existente
  await page.landingPage.submitLeadForm(dataTest)
  
  // Devo visualizar uma mensagem de alerta
  const expectedMessage = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(expectedMessage)

});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro com email incorreto
  const dataTest = {
    name: "Pedro Henrique",
    email: "pedrohteste.com.br"
  }
  await page.landingPage.submitLeadForm(dataTest)
  
  // Devo visualizar uma mensagem de alerta
  await page.landingPage.validateAlert('Email incorreto');
});

test('não deve cadastrar sem o nome preenchido', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro sem preencher o nome
  const dataTest = {
    name: "",
    email: "adrianobma@teste.com.br"
  }
  await page.landingPage.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.landingPage.validateAlert('Campo obrigatório');
});

test('não deve cadastrar sem o email preenchido', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro sem preencher o email
  const dataTest = {
    name: "Adriano B M A",
    email: ""
  }
  await page.landingPage.submitLeadForm(dataTest)
  
  // Devo visualizar uma mensagem de alerta
  await page.landingPage.validateAlert('Campo obrigatório');
});

test('não deve cadastrar sem os campos preenchidos', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.landingPage.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.landingPage.openLeadModal(text)

  // Quando solicito o cadastro sem preencher os campos
  const dataTest = {
    name: "",
    email: ""
  }
  await page.landingPage.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.landingPage.validateAlert(['Campo obrigatório', 'Campo obrigatório']);
});
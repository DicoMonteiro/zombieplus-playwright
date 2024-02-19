const { test, expect } = require('../support');

const { faker } = require('@faker-js/faker');


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de sucesso
  const expectedMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(expectedMessage)

});

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {
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
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro de um email já existente
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  const expectedMessage = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.popup.haveText(expectedMessage)

});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro com email incorreto
  const dataTest = {
    name: "Pedro Henrique",
    email: "pedrohteste.com.br"
  }
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.leads.validateAlert('Email incorreto');
});

test('não deve cadastrar sem o nome preenchido', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro sem preencher o nome
  const dataTest = {
    name: "",
    email: "adrianobma@teste.com.br"
  }
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.leads.validateAlert('Campo obrigatório');
});

test('não deve cadastrar sem o email preenchido', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro sem preencher o email
  const dataTest = {
    name: "Adriano B M A",
    email: ""
  }
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.leads.validateAlert('Campo obrigatório');
});

test('não deve cadastrar sem os campos preenchidos', async ({ page }) => {

  // Dado que já estou na página inicial
  await page.leads.visit()

  // E desejo me cadastrar na fila de espera
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)

  // Quando solicito o cadastro sem preencher os campos
  const dataTest = {
    name: "",
    email: ""
  }
  await page.leads.submitLeadForm(dataTest)

  // Devo visualizar uma mensagem de alerta
  await page.leads.validateAlert(['Campo obrigatório', 'Campo obrigatório']);
});

// Gestão de Leads

test('deve poder consultar uma lead cadastrada', async ({ page }) => {

  // Dado que tenho já cadastro de leads
  await page.leads.visit()
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }
  await page.leads.submitLeadForm(dataTest)

  // E desejo gerir as leads
  const dataTestLogin = {
    email: "admin@zombieplus.com",
    pass: "pwd123"
  }
  await page.login.loggedIn('Admin', dataTestLogin)
  await page.leads.goToLeads()

  // Quando solicito consultar uma lead cadastrada
 await page.leads.searchLead(dataTest.email)

  // Devo visualizar a lead na listagem
  await page.leads.validateLeadInList(dataTest.email)

});

test('não deve poder consultar uma lead inexistente', async ({ page }) => {

  // Dado que tenho já cadastro de leads
  await page.leads.visit()
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }
  await page.leads.submitLeadForm(dataTest)

  // E desejo gerir as leads
  const dataTestLogin = {
    email: "admin@zombieplus.com",
    pass: "pwd123"
  }
  await page.login.loggedIn('Admin', dataTestLogin)
  await page.leads.goToLeads()

  // Quando solicito consultar uma lead não cadastrada
 await page.leads.searchLead('testeqax@qax.br')

  // Devo visualizar uma mensagem de alerta
  await page.leads.validadeLeadNotFound()

});

test('deve poder remover uma lead cadastrada', async ({ page }) => {

  // Dado que tenho já cadastro de leads
  await page.leads.visit()
  const text = "Fila de espera"
  await page.leads.openLeadModal(text)
  const dataTest = {
    name: faker.person.fullName(),
    email: faker.internet.email()
  }
  await page.leads.submitLeadForm(dataTest)

  // E desejo gerir as leads
  const dataTestLogin = {
    email: "admin@zombieplus.com",
    pass: "pwd123"
  }
  await page.login.loggedIn('Admin', dataTestLogin)
  await page.leads.goToLeads()

  // Quando solicito a excluão de um lead cadastrado
 await page.leads.deleteLead(dataTest.email)

  // Então visualizo uma mensagem de sucesso
  await page.popup.haveText('Lead removido com sucesso.')

});
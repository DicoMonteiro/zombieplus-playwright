const { test: base, expect } = require('@playwright/test')

const { LandingPage } = require('../pages/LandingPage');
const { LoginPage } = require('../pages/LoginPage')
const { MoviesPage } = require('../pages/MoviesPage')
const { Toast } = require('../components/Toast')

const test = base.extend({
    page: async ({page}, use) => {
        await use({
            ...page,
            landingPage: new LandingPage(page),
            toast: new Toast(page),
            loginPage: new LoginPage(page),
            moviesPage: new MoviesPage(page)
        })
    }
})

export { test, expect }
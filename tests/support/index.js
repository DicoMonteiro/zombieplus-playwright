const { test: base, expect } = require('@playwright/test')

const { Leads } = require('./actions/Leads');
const { Login } = require('./actions/Login')
const { Movies } = require('./actions/Movies')
const { Tvshows } = require('./actions/Tvshows')
const { Popup } = require('./components/Popup')
const { Api } = require('./services/index')

const test = base.extend({
    page: async ({page}, use) => {

        page['leads'] = new Leads(page)
        page['popup'] = new Popup(page)
        page['login'] = new Login(page)
        page['movies'] = new Movies(page)
        page['tvshows'] = new Tvshows(page)

        await use(page)
    },
    request: async ({request}, use) => {

        request['api'] = new Api(request)

        await request['api'].sessionToken()

        await use(request)
    }
})

export { test, expect }
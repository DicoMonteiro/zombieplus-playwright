const { expect } = require('@playwright/test')

export class Api {

    constructor(request) {
        this.request = request
        this.token = undefined
    }

    async sessionToken() {
        const responseToken = await this.request.post('http://localhost:3333/sessions', {
            data: {
                email: "admin@zombieplus.com",
                password: "pwd123"
            }
        })

        expect(responseToken.ok()).toBeTruthy()

        const body = JSON.parse(await responseToken.text())

        this.token = body.token
    }

    async postMovie(movie) {

        const companyId = await this.getCompanyIdByName(movie.company)

        const responseMovie = await this.request.post('http://localhost:3333/movies', {
            headers: {
                Authorization: 'Bearer ' + this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                featured: movie.featured
            }
        });

        expect(responseMovie.ok()).toBeTruthy()

        //const body = JSON.parse(await responseMovie.text())

        //console.log(body)
    }

    async postTvshow(tvshow) {

        const companyId = await this.getCompanyIdByName(tvshow.company)

        const responseTvshow = await this.request.post('http://localhost:3333/tvshows', {
            headers: {
                Authorization: 'Bearer ' + this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: companyId,
                release_year: tvshow.release_year,
                seasons: tvshow.season,
                featured: tvshow.featured
            }
        });

        expect(responseTvshow.ok()).toBeTruthy()

        //const body = JSON.parse(await responseTvshow.text())

        //console.log(body)
    }

    async getCompanyIdByName(companyName) {

        const responseCompany = await this.request.get('http://localhost:3333/companies?name=' + companyName, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                ContentType: 'application/json'
            }
        });

        expect(responseCompany.ok()).toBeTruthy()

        const body = JSON.parse(await responseCompany.text())

        return body.data[0].id
    }
}
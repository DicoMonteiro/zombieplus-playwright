const { expect } = require('@playwright/test');

export class Popup {

    constructor(page) {
        this.page = page
    }

    async haveText(message) {
        const element = await this.page.locator('.swal2-html-container')
        await expect(element).toHaveText(message);
        //await expect(toast).toBeHidden({ timeout: 5000 })
        //await expect(popup).not.toBeVisible({ timeout: 5000 })
    }
}
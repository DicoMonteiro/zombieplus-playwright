const { expect } = require('@playwright/test');

export class Toast {

    constructor(page) {
        this.page = page
    }

    async containText(message) {
        const toast = await this.page.locator('.toast')
        await expect(toast).toContainText(message);
        //await expect(toast).toBeHidden({ timeout: 5000 })
        await expect(toast).not.toBeVisible({ timeout: 5000 })
    }
}
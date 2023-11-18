const {test, expect} = require('@playwright/test');
const {allure} = require("allure-playwright")
const {mockBaseUrl} = require("../config");
test.describe.parallel("Access token testing", () => {

    test(`GET - get token info`, async ({request}) => {
        let response;
        await allure.step("Visit todolist page", async () => {
            response = await request.get(`${mockBaseUrl}/api/v1/mock-token`);
        });
        expect(response.status()).toBe(200);
    });
});
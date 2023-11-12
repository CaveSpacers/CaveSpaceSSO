const {test, expect} = require('@playwright/test');
const {allure} = require("allure-playwright")
test.describe.parallel("Access token testing", () => {

    test(`POST - get token info by uuid`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$97';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(200);
        console.log(response.body());
    });
    test(`POST - get token info by uuid without auth`, async ({ request }) => {
        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(401);
        console.log(response.body());
    });
    test(`POST - get token info by uuid with invalid auth`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$9';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(401);
        console.log(response.body());
    });
    test(`POST - get non-existing token info`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$9';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120003"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(403);
        console.log(response.body());
    });
    test(`POST - get expired token info`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$9';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120004"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(400);
        console.log(response.body());
    });
    test(`POST - get token info by public port`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$9';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:8080/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(404);
        console.log(response.body());
    });
});
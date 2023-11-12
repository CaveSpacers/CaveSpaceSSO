const {test, expect} = require('@playwright/test');
const {allure} = require("allure-playwright")
const uuid = require("uuid");
const {generatePasswordHash} = require("../main/utils");
const {insertUser} = require("../main/db-utils");
test.describe.parallel("Access token testing", () => {

    test(`POST - get token info by uuid`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$97';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const plainPassword = "login1A!amo";
        const userForDb = {
            UserId: 'b5d2fa64-80bb-11ee-b962-0242ac120002',
            Name: 'Happy Max',
            Login: 'moxmock@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'client',
        };
        await insertUser(userForDb);
        const userIdObject = {
            UserId: userForDb.UserId,
        };
        //добавить инъекцию в БД с Токенами, проверять что он валидный?
        const response = await request.post('http://localhost:3001/api/v1/mock-token', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(userIdObject),
        });

        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.Login).toBe(userForDb.Login);
        expect(responseBody.Name).toBe(userForDb.Name);
        expect(responseBody.Role).toBe(userForDb.Role);
    });

    test(`POST - get token info by uuid without auth`, async ({ request }) => {
        const tokenData = {
            UserId: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token-noauth', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(401);
    });
    test(`POST - get token info by uuid with invalid auth`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$9';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            UserId: "b5d2fa64-80bb-11ee-b962-0242ac120002"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token-wrong-auth', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(401);
    });

    test(`POST - get non-existing token info`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$97';
        const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

        const tokenData = {
            UserId: "b5d2fa64-80bb-11ee-b962-0242ac120003"
        };

        const response = await request.post('http://localhost:3001/api/v1/mock-token-non-exist', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(tokenData),
        });

        expect(response.status()).toBe(403);
    });

    test(`POST - get expired token info`, async ({ request }) => {
        const username = 'sso';
        const password = 'UrO_9D]gJxJZ$97';
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
    });
});
const {test, expect} = require('@playwright/test');
const {allure} = require("allure-playwright")
const uuid = require("uuid");
const {generatePasswordHash, generateBase64Credentials, generateFormattedDate} = require("../main/utils");
const {insertUser, insertToken} = require("../main/db-utils");
const {ssoUsername, ssoPassword} = require("../config");
test.describe.parallel("Access token testing", () => {

    test(`POST - get token info by uuid`, async ({ request }) => {
//готовим данные
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);
        const plainPassword = "login1A!amo";
        const userDataForDb = {
            UserId: uuid.v4(),
            Name: 'Max Token',
            Login: 'validtokenmax@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'client',
        };
        await insertUser(userDataForDb);
        const tokenDataForDb = {
            UserId: userDataForDb.UserId,
            Token: uuid.v4(),
            ExpirationDateTime: generateFormattedDate(new Date(Date.now() + 15 * 60 * 1000))
        };
        await insertToken(tokenDataForDb);
        const userIdObject = {
            accessToken: tokenDataForDb.Token,
        };
// отправляем запрос на токен
        const response = await request.post('http://localhost:8082/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(userIdObject),
        });
// проверяем данные по токену
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.login).toBe(userDataForDb.Login);
        expect(responseBody.name).toBe(userDataForDb.Name);
        expect(responseBody.role).toBe(userDataForDb.Role);
    });

    test(`POST - get token info by uuid without auth`, async ({ request }) => {
        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post('http://localhost:8082/api/v1/access', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(anyTokenData),
        });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe("Unauthorized");

    });
    test(`POST - get token info by uuid with invalid auth`, async ({ request }) => {
        const wrongSsoPassword = "UrO_9D]gJxJZ$97"
        const base64Credentials = generateBase64Credentials(ssoUsername, wrongSsoPassword);

        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post('http://localhost:8082/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(anyTokenData),
        });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe("Unauthorized");
    });

    test(`POST - get non-existing token info`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);
        const nonExistingTokenData = {
            accessToken: "b5d2fa64-80bb-11ee-b962-111111111111"
        };

        const response = await request.post('http://localhost:8082/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(nonExistingTokenData),
        });

        expect(response.status()).toBe(403);
        expect(response.statusText()).toBe("Forbidden");
    });

    test(`POST - get expired token info`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);

        const plainPassword = "login1A!amoexp";
        const expiredUserDataForDb = {
            UserId: uuid.v4(),
            Name: 'Max Expired Token',
            Login: 'expiredtokenmax@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'renter',
        };
        await insertUser(expiredUserDataForDb);
        const expiredTokenDataForDb = {
            UserId: expiredUserDataForDb.UserId,
            Token: uuid.v4(),
            ExpirationDateTime: generateFormattedDate(new Date(Date.now() - 15 * 60 * 1000))
        };
        await insertToken(expiredTokenDataForDb);
        const ExpiredTokenData = {
            accessToken: expiredTokenDataForDb.Token,
        };

        const response = await request.post('http://localhost:8082/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(ExpiredTokenData),
        });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe("Bad Request");
    });

    test(`POST - get token info by public port`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);

        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post('http://localhost:8080/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
            },
            content: JSON.stringify(anyTokenData),
        });
        expect(response.status()).toBe(404);
        expect(response.statusText()).toBe("Not Found");
    });
});
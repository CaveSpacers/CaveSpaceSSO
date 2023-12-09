const {test, expect} = require('@playwright/test');
const {allure} = require("allure-playwright")
const uuid = require("uuid");
const {generatePasswordHash, generateBase64Credentials, generateFormattedDate} = require("../main/utils");
const {insertUser, insertToken} = require("../main/db-utils");
const {ssoUsername, ssoPassword, baseInternalUrl} = require("../config");
const {UserForDbBuilder} = require("../main/UserForDbBuilder");
test.describe.parallel("Access token testing", () => {

    test(`POST - get token info by uuid`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);
        const plainPassword = "login1A!amo";
        const passHash = await generatePasswordHash(plainPassword);
        const userForDb = new UserForDbBuilder()
            .withPasswordHash(passHash)
            .build();
        await insertUser(userForDb);

        const tokenDataForDb = {
            UserId: userForDb.UserId,
            Token: uuid.v4(),
            ExpirationDateTime: generateFormattedDate(new Date(Date.now() - 15 * 60 * 1000))
        };
        await insertToken(tokenDataForDb);
        const userIdObject = {
            accessToken: tokenDataForDb.Token,
        };

        const response = await request.post(`${baseInternalUrl}/api/v1/access`, {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
            },
            data: userIdObject,
        });

        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.login).toBe(userForDb.Login);
        expect(responseBody.name).toBe(userForDb.Name);
        expect(responseBody.role).toBe(userForDb.Role);
    });

    test(`POST - get token info by uuid without auth`, async ({ request }) => {
        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post(`${baseInternalUrl}/api/v1/access`, {
            data: anyTokenData,
        });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe("Unauthorized");

    });
    test(`POST - get token info by uuid with invalid auth`, async ({ request }) => {
        const wrongBase64Credentials = uuid.v4()

        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post(`${baseInternalUrl}/api/v1/access`, {
            headers: {
                Authorization: `Basic ${wrongBase64Credentials}`,
            },
            data: anyTokenData,
        });

        expect(response.status()).toBe(401);
        expect(response.statusText()).toBe("Unauthorized");
    });

    test(`POST - get non-existing token info`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);
        const nonExistingTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post(`${baseInternalUrl}/api/v1/access`, {
            headers: {
                Authorization: `Basic ${base64Credentials}`
            },
            data: nonExistingTokenData,
        });

        expect(response.status()).toBe(403);
        expect(response.statusText()).toBe("Forbidden");
    });

    test(`POST - get expired token info`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);
        const plainPassword = "login1A!amoexp";
        const passHash = await generatePasswordHash(plainPassword);
        const expiredUserDataForDb = new UserForDbBuilder()
            .withPasswordHash(passHash)
            .build();
        await insertUser(expiredUserDataForDb);

        const expiredTokenDataForDb = {
            UserId: expiredUserDataForDb.UserId,
            Token: uuid.v4(),
            ExpirationDateTime: generateFormattedDate(new Date(Date.now() - 15 * 60 * 1000))
        };
        await insertToken(expiredTokenDataForDb);
        const expiredTokenData = {
            accessToken: expiredTokenDataForDb.Token,
        };

        const response = await request.post(`${baseInternalUrl}/api/v1/access`, {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
            },
            data: expiredTokenData,
        });

        expect(response.status()).toBe(400);
        expect(response.statusText()).toBe("Bad Request");
    });

    test(`POST - get token info by public port`, async ({ request }) => {
        const base64Credentials = generateBase64Credentials(ssoUsername, ssoPassword);

        const anyTokenData = {
            accessToken: uuid.v4()
        };

        const response = await request.post('/api/v1/access', {
            headers: {
                Authorization: `Basic ${base64Credentials}`,
            },
            data: anyTokenData,
        });
        expect(response.status()).toBe(404);
        expect(response.statusText()).toBe("Not Found");
    });
});
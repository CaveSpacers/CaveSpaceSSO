const {test, expect} = require('@playwright/test');
const {getTokenByUserId, insertUser} = require('../main/db-utils');
const uuid = require("uuid");
test.describe.parallel("Login testing", () => {
    const baseUrl = 'http://localhost:8080';

    test(`POST - login with valid credentials`, async ({request}) => {
        const userForDb = {
            userId: uuid.v4(), name: 'Max', login: 'maxdb@gmail.com', password: 'login1A!a', role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            login: 'maxdb@gmail.com',
            password: 'login1A!a',
        };
        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.accessToken).toBeTruthy();

        const tokenData = await getTokenByUserId(userForDb.userId);
        expect(tokenData.Token).toBe(responseBody.accessToken);

        const expirationTimeInMillis = new Date(tokenData.ExpirationDateTime).getTime();
        const currentTimeInMillis = Date.now();
        const timeDifference = expirationTimeInMillis - currentTimeInMillis;

        expect(timeDifference).toBeCloseTo(900000, {delta: 10000});
    });

    test(`POST - login with invalid password`, async ({request}) => {
        const userForDb = {
            userId: uuid.v4(), name: 'Max', login: 'maxdbinvpass@gmail.com', password: 'login22!A', role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            login: 'maxdbinvpass@gmail.com',
            password: 'login1A!a22',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");
    });

    test(`POST - login with invalid login`, async ({request}) => {
        const userForDb = {
            userId: uuid.v4(), name: 'Max', login: 'maxdbinlog@gmail.com', password: 'login22!A', role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            login: 'maxdbinlog2@gmail.com',
            password: 'login22!A',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");

    });

    test(`POST - token expiration update`, async ({request}) => {
        const userForDb = {
            userId: uuid.v4(), name: 'Max', login: 'maxdbvalid@gmail.com', password: 'login22!A', role: 'renter',
        };
        await insertUser(userForDb);
        const loginUserData = {
            login: 'maxdbvalid@gmail.com',
            password: 'login22!A',
        };

        const responseFirst = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(responseFirst.status()).toBe(200);

        const tokenDataFirst = await getTokenByUserId(userForDb.userId);
        const expirationTimeInMillisFirst = new Date(tokenDataFirst.ExpirationDateTime).getTime();

        const responseSecond = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(responseSecond.status()).toBe(200);

        const tokenDataSecond = await getTokenByUserId(userForDb.userId);
        const expirationTimeInMillisSecond = new Date(tokenDataSecond.ExpirationDateTime).getTime();

        expect(expirationTimeInMillisFirst).not.toBe(expirationTimeInMillisSecond);
        expect(tokenDataFirst.Token).not.toBe(tokenDataSecond.Token);
    });
});
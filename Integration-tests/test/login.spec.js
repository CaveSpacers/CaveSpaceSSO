const {test, expect} = require('@playwright/test');
const {getTokenRecordByUserId, insertUser} = require('../main/db-utils');
const uuid = require("uuid");
const {generatePasswordHash} = require("../main/utils");
test.describe.parallel("Login testing", () => {
    const baseUrl = 'http://localhost:8080';

    test(`POST - login with valid credentials`, async ({request}) => {
        const plainPassword = "login1A!a";
        const userForDb = {
            UserId: uuid.v4(),
            Name: 'Max',
            Login: 'maxdb@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            Login: 'maxdb@gmail.com',
            Password: plainPassword,
        };
        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.accessToken).toBeTruthy();

        const tokenData = await getTokenRecordByUserId(userForDb.UserId);
        expect(tokenData.Token).toBe(responseBody.accessToken);

        const expirationTimeInMillis = new Date(tokenData.ExpirationDateTime).getTime();
        const currentTimeInMillis = Date.now();
        const timeDifference = expirationTimeInMillis - currentTimeInMillis;

        expect(timeDifference).toBeCloseTo(900000, {delta: 10000});
    });

    test(`POST - login with invalid password`, async ({request}) => {
        const invalidPassword = "login22!A";
        const userForDb = {
            UserId: uuid.v4(),
            Name: 'Max',
            Login: 'maxdbinvpass@gmail.com',
            PasswordHash: await generatePasswordHash(invalidPassword),
            Role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            Login: 'maxdbinvpass@gmail.com',
            Password: 'login22!A2',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");
    });

    test(`POST - login with invalid login`, async ({request}) => {
        const plainPassword = "login22!A";
        const userForDb = {
            UserId: uuid.v4(),
            Name: 'Max',
            Login: 'maxdbinlog@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'renter',
        };
        await insertUser(userForDb);

        const loginUserData = {
            Login: 'maxdbinlog2@gmail.com',
            Password: 'login22!A',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");

    });

    test(`POST - token expiration update`, async ({request}) => {
        const plainPassword = "login22!A";
        const userForDb = {
            UserId: uuid.v4(),
            Name: 'Max',
            Login: 'maxdbvalid@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'renter',
        };
        await insertUser(userForDb);
        const loginUserData = {
            Login: 'maxdbvalid@gmail.com',
            Password: 'login22!A',
        };

        const responseFirst = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(responseFirst.status()).toBe(200);

        const tokenDataFirst = await getTokenRecordByUserId(userForDb.UserId);
        const expirationTimeFirst = new Date(tokenDataFirst.ExpirationDateTime);

        const responseSecond = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(responseSecond.status()).toBe(200);
        const responseSecondBody = JSON.parse(await responseSecond.text());

        const tokenDataSecond = await getTokenRecordByUserId(userForDb.UserId);
        const expirationTimeSecond = new Date(tokenDataSecond.ExpirationDateTime);

        expect(expirationTimeFirst).not.toBe(expirationTimeSecond);
        expect(tokenDataFirst.Token).not.toBe(tokenDataSecond.Token);
        expect(tokenDataSecond.Token).toBe(responseSecondBody.accessToken);
    });
});
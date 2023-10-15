const {test, expect} = require('@playwright/test');
const {getUserByLogin, getTokenByUserId} = require('../main/db-utils');


test.describe.parallel("Login testing", () => {

    const baseUrl = 'http://localhost:8080';
    const validUserData = {
        name: 'LoginSeva',
        login: 'sevalogin@gmail.com',
        password: 'login1A!a',
        role: 'renter',
    };
    const validUserData2 = {
        name: 'LoginSeva2',
        login: 'sevalogin2@gmail.com',
        password: 'login1A!a',
        role: 'renter',
    };

    test(`POST - login with valid credentials`, async ({request}) => {
        await request.post(`${baseUrl}/api/v1/registry`, {
            data: validUserData
        });
        const loginUserData = {
            login: 'sevalogin@gmail.com',
            password: 'login1A!a',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(200);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody.accessToken).toBeTruthy();

        const user = await getUserByLogin(loginUserData.login);

        const tokenData = await getTokenByUserId(user[0].UserId);
        expect(tokenData[0].Token).toBe(responseBody.accessToken);

        const expirationTimeInMillis = new Date(tokenData[0].ExpiredDateTime).getTime();
        const currentTimeInMillis = Date.now();
        const timeDifference = expirationTimeInMillis - currentTimeInMillis;

        expect(timeDifference).toBeCloseTo(900000, {delta: 10000});
    });

    test(`POST - login with invalid password`, async ({request}) => {
        const loginUserData = {
            login: 'sevalogin@gmail.com',
            password: 'login1A!a2',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");
    });

    test(`POST - login with invalid login`, async ({request}) => {
        const loginUserData = {
            login: 'sevalogin1@gmail.com',
            password: 'login1A!a',
        };

        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("InvalidCredentials");

    });
    test(`POST - token expiration update`, async ({request}) => {
        await request.post(`${baseUrl}/api/v1/registry`, {
            data: validUserData2
        });
        const loginUserData = {
            login: 'sevalogin2@gmail.com',
            password: 'login1A!a',
        };

        const responseFirst = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });

        JSON.parse(await responseFirst.text());

        
        const user = await getUserByLogin(loginUserData.login);
        const tokenDataFirst = await getTokenByUserId(user[0].UserId);
        const expirationTimeInMillisFirst = new Date(tokenDataFirst[0].ExpiredDateTime).getTime();

        const responseSecond = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(responseSecond.status()).toBe(200);
        const tokenDataSecond = await getTokenByUserId(user[0].UserId);
        const expirationTimeInMillisSecond = new Date(tokenDataSecond[0].ExpiredDateTime).getTime();

        expect(expirationTimeInMillisFirst).not.toBe(expirationTimeInMillisSecond);
    });
});
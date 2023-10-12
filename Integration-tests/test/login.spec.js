const {test, expect} = require('@playwright/test');
const {getUserByEmail, getTokenByUserId, insertUser} = require('../main/db-utils');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');


test.describe.parallel("Login testing",() => {
    const baseUrl = 'http://localhost:8080';
    const validUserData = {
        userId: uuid.v4(),
        name: 'LoginSeva',
        login: 'sevalogin@gmail.com',
        password: 'login1A!a',
        role: 'renter',
    };
    //await insertUser(validUserData);
    test(`POST - login with valid credentials`, async ({request}) => {
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

        const user = await getUserByEmail(loginUserData.login);
        expect(user.UserId).toBeTruthy();

        const tokenData = getTokenByUserId(user.UserId);
        expect(tokenData.TokenHash).toBe(bcrypt.hashSync(responseBody.accessToken));

        const expirationTimeInMillis = new Date(tokenData.ExpiredDateTime).getTime();
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
            expect(responseBody[0].code).toBe("InvalidCredentials");;
        });
    test(`POST - token expiration update`, async ({request}) => {
        const loginUserData = {
            login: 'sevalogin@gmail.com',
            password: 'login1A!a',
        };

        const response1 = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response1.status()).toBe(200);

        const responseBody1 = JSON.parse(await response1.text());
        expect(responseBody1.accessToken).toBeTruthy();

        const user = await getUserByEmail(loginUserData.login);
        const tokenData1 = getTokenByUserId(user.UserId);
        const expirationTimeInMillis1 = new Date(tokenData1.ExpiredDateTime).getTime();

        const response2 = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response1.status()).toBe(200);
        const tokenData2 = getTokenByUserId(user.UserId);
        const expirationTimeInMillis2 = new Date(tokenData1.ExpiredDateTime).getTime();

        expect(expirationTimeInMillis1).not.toBe(expirationTimeInMillis2);
    });
    //expect(responseBody[0].code).toBe("UserAlreadyExist");
    // test(`POST - create new user with role client`, async ({request}) => {
    //     const userData = {
    //         name: 'Max', login: 'max@gmail.com', password: '1q2w!aA123', role: 'client'
    //     };
    //     const response = await request.post(`${baseUrl}/api/v1/registry`, {
    //         data: userData
    //     });
    //
    //     expect(response.status()).toBe(200);
    //
    //     const users = await getUserByEmail(userData.login);
    //     expect(users.length).toBe(1);
    //     expect(users[0].Name).toBe(userData.name);
    //     expect(users[0].Role).toBe(userData.role);
    // });
    //
    // test('POST - create same email user', async ({request}) => {
    //     const existingUserData = {
    //         userId: uuid.v4(), name: 'Max', login: 'max2@gmail.com', password: '1q2w!aA123', role: 'renter',
    //     };
    //     const newUserWithSameEmail = {
    //         name: 'Fake Max', login: 'max2@gmail.com', password: '1q2w!aA123', role: 'renter',
    //     };
    //     await insertUser(existingUserData);
    //     const response = await request.post(`${baseUrl}/api/v1/registry`, {
    //         data: newUserWithSameEmail,
    //     });
    //     expect(response.status()).toBe(409);
    //     const responseBody = JSON.parse(await response.text());
    //     expect(responseBody[0].code).toBe("UserAlreadyExist");
    // });
    // test('POST - create user with short password', async ({request}) => {
    //     const response = await request.post(`${baseUrl}/api/v1/registry`, {
    //         data: {
    //             name: 'Seva', login: 'seva@gmail.com', password: '1q2w!aA', role: 'renter'
    //         }
    //     });
    //     const responseBody = JSON.parse(await response.text());
    //     expect(response.status()).toBe(400);
    //     expect(responseBody[0].code).toBe("PasswordTooShort");
    // });

});
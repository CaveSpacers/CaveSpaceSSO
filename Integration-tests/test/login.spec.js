const {test, expect} = require('@playwright/test');
const {getUserByEmail, insertUser} = require('../main/db-utils');
const uuid = require('uuid');

test.describe.parallel("Login testing", () => {
    const baseUrl = 'http://localhost:8080';
    const validUserData = {
        name: 'LoginSeva',
        login: 'sevalogin@gmail.com',
        password: 'login1A!a',
        role: 'renter',
    };

    test(`POST - login with valid credentials`, async ({ request }) => {
        const loginUserData = {
            login: 'sevalogin@gmail.com',
            password: 'login1A!a',
        };
        await request.post(`${baseUrl}/api/v1/registry`, {
            data: validUserData,
        });
        const response = await request.post(`${baseUrl}/api/v1/login`, {
            data: loginUserData,
        });
        expect(response.status()).toBe(400);

        const responseBody = JSON.parse(await response.text());
        //expect(responseBody[0].code).toBe("UserAlreadyExist");
    });
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
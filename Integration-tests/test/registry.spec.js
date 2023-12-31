const {test, expect} = require('@playwright/test');
const {getUserByLogin, insertUser} = require('../main/db-utils');
const bcrypt = require("bcryptjs")
const {UserBuilder} = require("../main/UserBuilder");
const {UserForDbBuilder} = require("../main/UserForDbBuilder");
const Chance = require('chance');
const chance = new Chance();
test.describe.parallel("Registration testing", () => {
    
    test(`POST - create new user with role renter`, async ({request}) => {
        const userData = new UserBuilder()
            .withRole('renter')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });

        expect(response.status()).toBe(200);

        const users = await getUserByLogin(userData.login);
        expect(users.Name).toBe(userData.name);
        expect(users.Role).toBe(userData.role);
        expect(await bcrypt.compare(userData.password,users.PasswordHash)).toBe(true);
    });
    test(`POST - create new user with role client`, async ({request}) => {
        const userData = new UserBuilder()
            .withRole('client')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        expect(response.status()).toBe(200);

        const users = await getUserByLogin(userData.login);
        expect(users.Name).toBe(userData.name);
        expect(users.Role).toBe(userData.role);
    });

    test('POST - create same email user', async ({request}) => {
        const existingUserData = new UserForDbBuilder()
            .withLogin('max3@gmail.com')
            .build();
        const newUserWithSameEmail = new UserBuilder()
            .withLogin('max3@gmail.com')
            .build();

        await insertUser(existingUserData);
        const response = await request.post(`/api/v1/registry`, {
            data: newUserWithSameEmail,
        });
        expect(response.status()).toBe(409);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.code).toBe("UserAlreadyExist");
    });
    test('POST - create user with short password', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('A1!gth4')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("PasswordTooShort");
    });
    test('POST - password without capital letters', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('a1!gth42')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("PasswordMissingUppercase");
    });
    test('POST - password without specsymbols', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('a1Asgth42')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("PasswordMissingSpecialCharacter");
    });
    test('POST - password without digits', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('a!gthAAAf')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("PasswordMissingDigit");
    });
    test('POST - invalid email format', async ({request}) => {
        const userData = new UserBuilder()
            .withLogin('seva@gmail')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("InvalidEmailFormat");
    });
    test('POST - invalid email format - 2', async ({request}) => {
        const userData = new UserBuilder()
            .withLogin('seva@')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("InvalidEmailFormat");
    });
    test('POST - invalid email format - 3', async ({request}) => {
        const userData = new UserBuilder()
            .withLogin('seva_gmail.com')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("InvalidEmailFormat");
    });
    test('POST - invalid user role', async ({request}) => {
        const userData = new UserBuilder()
            .withRole('admin')
            .withPassword('U23hdsd!8')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("InvalidRole");
    })
    test('POST - too long name', async ({request}) => {
        const userData = new UserBuilder()
            .withName('s'.repeat(51))
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("NameIsTooLong");
    });
    test('POST - too long email', async ({request}) => {
        const userData = new UserBuilder()
            .withLogin('s'.repeat(41) + "@gmail.com")
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("EmailIsTooLong");
    });
    test('POST - too long password', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('s'.repeat(47) + "!1Aa")
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody.code).toBe("PasswordIsTooLong");
    });
});


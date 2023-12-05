const {test, expect} = require('@playwright/test');
const {getUserByLogin, insertUser} = require('../main/db-utils');
const uuid = require('uuid');
const {generatePasswordHash} = require("../main/utils");
const bcrypt = require("bcryptjs")
const UserBuilder = require("../main/userBuilder");
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
        const plainPassword = "1q2w!aA123";
        const existingUserData = {
            UserId: uuid.v4(),
            Name: 'Max',
            Login: 'max2@gmail.com',
            PasswordHash: await generatePasswordHash(plainPassword),
            Role: 'renter',
        };
        const newUserWithSameEmail = new UserBuilder()
            .withLogin('max2@gmail.com')
            .build();

        await insertUser(existingUserData);
        const response = await request.post(`/api/v1/registry`, {
            data: newUserWithSameEmail,
        });
        expect(response.status()).toBe(409);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody[0].code).toBe("UserAlreadyExist");
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
        expect(responseBody[0].code).toBe("PasswordTooShort");
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
        expect(responseBody[0].code).toBe("PasswordMissingUppercase");
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
        expect(responseBody[0].code).toBe("PasswordMissingSpecialCharacter");
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
        expect(responseBody[0].code).toBe("PasswordMissingDigit");
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
        expect(responseBody[0].code).toBe("InvalidEmailFormat");
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
        expect(responseBody[0].code).toBe("InvalidEmailFormat");
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
        expect(responseBody[0].code).toBe("InvalidEmailFormat");
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
        expect(responseBody[0].code).toBe("InvalidRole");
    })
    test('POST - too long name', async ({request}) => {
        const userData = new UserBuilder()
            .withName('Seva12345123451234512345123451234512345123451234512')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody[0].code).toBe("NameIsTooLong");
    });
    test('POST - too long email', async ({request}) => {
        const userData = new UserBuilder()
            .withLogin('seva12345123451234512345123451234512345123451234512@gmail.com')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody[0].code).toBe("EmailIsTooLong");
    });
    test('POST - too long password', async ({request}) => {
        const userData = new UserBuilder()
            .withPassword('1q2w!aA1231q2w!aA1231q2w!aA1231q2w!aA1231q2w!aA1231')
            .build();
        const response = await request.post(`/api/v1/registry`, {
            data: userData
        });
        const responseBody = JSON.parse(await response.text());
        expect(response.status()).toBe(400);
        expect(responseBody[0].code).toBe("PasswordIsTooLong");
    });
});


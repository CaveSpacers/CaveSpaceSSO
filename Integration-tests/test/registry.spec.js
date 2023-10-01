const {test, expect} = require('@playwright/test');
test.describe.parallel("Registration testing", () => {
    const baseUrl = 'http://localhost:8080'
    test('POST - create new user', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2w!aA123',
                role: 'renter',
            },
        });
        // const responseBody = JSON.parse(await response.text())
        //     console.log(responseBody)
        expect(response.status()).toBe(200)
    });
    test('POST - create user with short password', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2w!aA',
                role: 'renter'
            },
        });
        const responseBody = JSON.parse(await response.text())
        console.log(responseBody)
        expect(response.status()).toBe(400)
        expect(responseBody[0].code).toBe('PasswordTooShort')
    });
    test('POST - password without capital letters', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2w!aa223',
                role: 'renter',
            },
        });
        // const responseBody = JSON.parse(await response.text())
        //     console.log(responseBody)
        expect(response.status()).toBe(400)
        //expect(responseBody.code).toBe('PasswordTooShort')
    });
    test('POST - password without specsymbols', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2Waa223',
                role: 'renter',
            },
        });
        // const responseBody = JSON.parse(await response.text())
        //     console.log(responseBody)
        expect(response.status()).toBe(400)
        //expect(responseBody.code).toBe('PasswordTooShort')
    })
    test('POST - password without digits', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: 'aqewaaFf!',
                role: 'renter',
            },
        })
        // const responseBody = JSON.parse(await response.text())
        //     console.log(responseBody)
        expect(response.status()).toBe(400)
        //expect(responseBody.code).toBe('PasswordTooShort')
    })
})
import {Client} from "pg";


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432:5432",
    password: "postgres",
    database: "sso-postgres"
})

client.connect();

client.query('Select * from "Users"', (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
})
client.end;
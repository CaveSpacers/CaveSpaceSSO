const {test, expect} = require('@playwright/test');
test.describe.parallel("Registration testing", () => {
    const baseUrl = 'http://localhost:8080'
    test('POST - create new renter', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2w!aA123',
                role: 'renter',
            },
        });
        expect(response.status()).toBe(200)
    });
    test('POST - create new client', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Max',
                email: 'max@gmail.com',
                password: '1q2w!aA123',
                role: 'client',
            },
        });
        expect(response.status()).toBe(200)
    });
    test('POST - create same email user', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Max',
                email: 'seva@gmail.com',
                password: '1q2w!aA123',
                role: 'rentor',
            },
        });
        //const responseBody = JSON.parse(await response.text())
        //console.log(responseBody)
        expect(response.status()).toBe(400)
        //expect(responseBody[0].message).toBe("The Password must contain at least 8 characters")
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
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Password must contain at least 8 characters")
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
         const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Password must contain at least one capital letter")
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
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Password must contain at least one special character")
    });
    test('POST - password without digits', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: 'aqewaaFf!',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Password must contain at least one digit")
    });
    test('POST - invalid email format', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail',
                password: '1q2w!aA123',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Email format is not valid")
    });
    test('POST - invalid email format - 2', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@',
                password: '1q2w!aA123',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Email format is not valid")
    });
    test('POST - invalid email format - 3', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva_gmail.com',
                password: '1q2w!aA123',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Email format is not valid")
    });
    test('POST - invalid user role', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva2@gmail.com',
                password: '1q2w!aA123',
                role: 'rentor'
            }
        });
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Role is not valid")
    })
    test('POST - too long name', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva12345123451234512345123451234512345123451234512',
                email: 'seva2@gmail.com',
                password: '1q2w!aA123',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Name is longer than 50 characters")
    });
    test('POST - too long email', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva12345123451234512345123451234512345123451234512@gmail.com',
                password: '1q2w!aA123',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Email is longer than 50 characters")
    });
    test('POST - too long password', async ({request}) => {
        const response = await request.post(`${baseUrl}/api/v1/registry`, {
            data: {
                name: 'Seva',
                email: 'seva@gmail.com',
                password: '1q2w!aA1231q2w!aA1231q2w!aA1231q2w!aA1231q2w!aA1231',
                role: 'renter',
            },
        })
        const responseBody = JSON.parse(await response.text())
        expect(response.status()).toBe(400)
        expect(responseBody[0].description).toBe("The Password is longer than 50 characters")
    });
});

// import {Client} from "pg";
//
//
// const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     port: "5432:5432",
//     password: "postgres",
//     database: "sso-postgres"
// })

// client.connect();
//
// client.query('Select * from "Users"', (err, res) => {
//     if (!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
// })
// client.end;
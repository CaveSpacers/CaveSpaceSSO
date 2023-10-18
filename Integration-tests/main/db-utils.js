const {Client} = require('pg');
const bcrypt = require("bcryptjs");
const getClient = () => {
    return new Client({
        host: 'localhost', user: 'postgres', port: 5432, password: 'postgres', database: 'sso-postgres',
    });
};

const connectToDatabase = async () => {
    const client = getClient();
    await client.connect();
    return client;
};
const disconnectFromDatabase = async (client) => {
    await client.end();
};
const getUserByLogin = async (login) => {
    const client = await connectToDatabase();
    try {
        const query = 'SELECT * FROM "Users" WHERE "Login" = $1';
        const result = await client.query(query, [login]);
        const user = result.rows[0];
        return user || null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        await disconnectFromDatabase(client);
    }
};
const getTokenByUserId = async (userId) => {
    const client = await connectToDatabase();
    try {
        const query = 'SELECT * FROM "Tokens" WHERE "UserId" = $1';
        const result = await client.query(query, [userId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        await disconnectFromDatabase(client);
    }
};
const insertUser = async (userData) => {
    const client = await connectToDatabase();

    const plainPassword = userData.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    const insertQuery = `
    INSERT INTO "Users" ("UserId","Name", "Login", "PasswordHash", "Role")
    VALUES ($1, $2, $3, $4, $5)`;

    try {
        await client.query(insertQuery, [userData.userId, userData.name, userData.login, passwordHash, userData.role]);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await disconnectFromDatabase(client);
    }
};
module.exports = {
    getUserByLogin, insertUser, getTokenByUserId
};
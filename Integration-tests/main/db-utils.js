const {Client} = require('pg');

const getClient = () => {
    return new Client({
        host: 'sso-postgres', user: 'postgres', port: 5432, password: 'postgres', database: 'sso-postgres',
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
const getUserRecordByLogin = async (Login) => {
    const client = await connectToDatabase();
    try {
        const query = 'SELECT * FROM "Users" WHERE "Login" = $1';
        const result = await client.query(query, [Login]);
        const user = result.rows[0];
        return user || null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    } finally {
        await disconnectFromDatabase(client);
    }
};
const getTokenRecordByUserId = async (UserId) => {
    const client = await connectToDatabase();
    try {
        const query = 'SELECT * FROM "Tokens" WHERE "UserId" = $1';
        const result = await client.query(query, [UserId]);
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

    const insertQuery = `
    INSERT INTO "Users" ("UserId", "Name", "Login", "PasswordHash", "Role")
    VALUES (
        '${userData.UserId}',
        '${userData.Name}',
        '${userData.Login}',
        '${userData.PasswordHash}',
        '${userData.Role}'
    )`;

    try {
        await client.query(insertQuery);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        await disconnectFromDatabase(client);
    }
};
module.exports = {
    getUserByLogin: getUserRecordByLogin, insertUser, getTokenRecordByUserId
};
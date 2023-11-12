module.exports = {
    dbhost: process.env.DB_HOST ?? '5432:5432',
    baseUrl: process.env.BASE_URL ?? 'http://localhost:8080',
    mockBaseUrl: process.env.MOCK_BASE_URL ?? 'http://localhost:3001',
};
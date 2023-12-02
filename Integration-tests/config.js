module.exports = {
    dbhost: process.env.DB_HOST ?? 'localhost',
    baseUrl: process.env.BASE_PUBLIC_URL ?? 'http://localhost:8080',
    baseInternalUrl: process.env.BASE_INTERNAL_URL ?? 'http://localhost:8082',
    mockBaseUrl: process.env.MOCK_BASE_URL ?? 'http://localhost:3001',
    ssoUsername: 'sso',
    ssoPassword: 'UrO_9D]gJxJZ97'
};
const bcrypt = require("bcryptjs");

const generatePasswordHash = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};
const generateBase64Credentials = (username, password) => {
    return Buffer.from(`${username}:${password}`).toString('base64');
};
const generateFormattedDate = (date) => {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZoneName: 'short',
        timeZone: 'UTC',
    });
};

module.exports = {
    generatePasswordHash, generateBase64Credentials, generateFormattedDate
};
const bcrypt = require("bcryptjs");
const btoa = require("btoa");
const generatePasswordHash = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};
const generateBase64Credentials = (username, password) => btoa(`${username}:${password}`);

const padTo2Digits = (value) => value.toString().padStart(2, '0');
const generateFormattedDate = (date) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const year = date.getFullYear();
    const month = padTo2Digits(date.getMonth() + 1);
    const day = padTo2Digits(date.getDate());
    const hour = padTo2Digits(date.getHours());
    const minute = padTo2Digits(date.getMinutes());
    const second = padTo2Digits(date.getSeconds());
    const milliseconds = padTo2Digits(date.getMilliseconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${milliseconds} ${timeZone}`;
};

module.exports = {
    generatePasswordHash, generateBase64Credentials, generateFormattedDate
};
const bcrypt = require("bcryptjs");

const generatePasswordHash = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
};

module.exports = {
    generatePasswordHash
};
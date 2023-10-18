const bcrypt = require("bcryptjs");
const generatePasswordHash = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(plainPassword, salt);
    } catch (error) {
        console.error('Error while generating password hash:', error);
        throw error;
    }
}
module.exports = {
    generatePasswordHash
};
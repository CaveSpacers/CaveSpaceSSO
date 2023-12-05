const Chance = require('chance');
const chance = new Chance();
const generator = require('generate-password');
class UserBuilder {
    constructor() {
        this.userData = {
            name: chance.name(),
            login: chance.email(),
            password: '!' + generator.generate({
                length: 7,
                numbers: true,
                symbols: false,
                uppercase: true,
                lowercase: true,
                strict: true,
            }),
            role: chance.pickone(['client', 'renter'])
        };
    }
    withName(name) {
        this.userData.name = name;
        return this;
    }
    withLogin(login) {
        this.userData.login = login;
        return this;
    }
    withPassword(password) {
        this.userData.password = password;
        return this;
    }
    withRole(role) {
        this.userData.role = role;
        return this;
    }
    build() {
        return { ...this.userData };
    }
}

module.exports = UserBuilder;
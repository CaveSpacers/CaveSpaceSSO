const Chance = require('chance');
const chance = new Chance();
const generator = require('generate-password');
const uuid = require("uuid");
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
class UserDataForDbBuilder {
    constructor() {
        this.userData = {
            UserId: uuid.v4(),
            Name: chance.name(),
            Login: chance.email(),
            PasswordHash: '$2a$10$6AaqpqqqBNdF.NN2gdFbxuSArpEw0VrkUjWJctBXRDIjCOkysbs8e',
            Role: chance.pickone(['client', 'renter'])
        };
    }

    withUserId(userId) {
        this.userData.UserId = userId;
        return this;
    }

    withName(name) {
        this.userData.Name = name;
        return this;
    }

    withLogin(login) {
        this.userData.Login = login;
        return this;
    }

    withPassword(passwordHash) {
        this.userData.PasswordHash = passwordHash;
        return this;
    }

    withRole(role) {
        this.userData.Role = role;
        return this;
    }

    build() {
        return { ...this.userData };
    }
}

module.exports = {UserBuilder, UserDataForDbBuilder};
const Chance = require('chance');
const chance = new Chance();
const uuid = require("uuid");
class UserForDbBuilder {
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

    withPasswordHash(passwordHash) {
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
module.exports = {UserForDbBuilder: UserForDbBuilder};
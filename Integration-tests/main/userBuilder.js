// UserBuilder.js
class UserBuilder {
    constructor() {
        this.userData = {
            name: 'DefaultName',
            login: 'default@example.com',
            password: '1q2w!aA123',
            role: 'client',
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
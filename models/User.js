const db = require('../services/db');

class Users {
    constructor() {
        this.db = db;
    }

    async getUser(email) {
        const user = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
        return user[0];
    }

    async createUser(first_name, last_name, email, password) {
        const user = await this.db.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [first_name, last_name, email, password]);
        return user[0];
    }

    async updateUser(first_name, last_name, email, password) {
        const user = await this.db.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE email = ?', [first_name, last_name, email, password, email]);
        return user[0];
    }
}

module.exports = new Users();

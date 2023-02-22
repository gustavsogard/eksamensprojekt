const db = require('../services/db');

async function getUser(email) {
    const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
}

async function createUser(first_name, last_name, email, password) {
    const user = await db.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [first_name, last_name, email, password]);
    return user[0];
}

async function updateUser(first_name, last_name, email, password) {
    const user = await db.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE email = ?', [first_name, last_name, email, password, email]);
    return user[0];
}

module.exports = {
    getUser,
    createUser,
    updateUser
};
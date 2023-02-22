const database = require('../models/User.js');

const logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await database.getUser(email);

    if (email === '' || password === '') {
        res.render('../views/pages/login.ejs', {error: 'All fields are required'});
        return;
    }
    if (user === undefined) {
        res.render('../views/pages/login.ejs', {error: 'Email does not exist'});
        return;
    }
    if (user.password !== password) {
        res.render('../views/pages/login.ejs', {error: 'Incorrect password'});
        return;
    }

    req.session.loggedin = true;
    req.session.user = user;
    res.redirect('/');
}

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm } = req.body;
        const checkUser = await database.getUser(email);

        if (first_name === '' || last_name === '' || email === '' || password === '' || confirm === '') {
            res.render('../views/pages/register.ejs', {error: 'All fields are required'});
            return;
        }
        if (password !== confirm) {
            res.render('../views/pages/register.ejs', {error: 'Passwords do not match'});
            return;
        }
        if (checkUser !== undefined) {
            res.render('../views/pages/register.ejs', {error: 'Email already exists'});
            return;
        }

        if (password.length < 6) {
            res.render('../views/pages/register.ejs', {error: 'Password must be at least 6 characters'});
            return;
        }

        database.createUser(first_name, last_name, email, password);
        res.redirect('/login');
    } catch (error) {
        res.render('../views/pages/register.ejs', {error: error});
    }
}

const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm } = req.body;
        const checkUser = await database.getUser(email);

        if (first_name === '' || last_name === '' || email === '' || password === '' || confirm === '') {
            res.render('../views/pages/account.ejs', {error: 'All fields are required'});
            return;
        }
        if (password !== confirm) {
            res.render('../views/pages/account.ejs', {error: 'Passwords do not match'});
            return;
        }
        if (checkUser !== undefined && email !== req.session.user.email) {
            res.render('../views/pages/account.ejs', {error: 'Email is not valid'});
            return;
        }

        if (password.length < 6) {
            res.render('../views/pages/account.ejs', {error: 'Password must be at least 6 characters'});
            return;
        }

        database.updateUser(first_name, last_name, email, password);
        res.redirect('/account');
    } catch (error) {
        res.render('../views/pages/account.ejs', {error: error});
    }
}

module.exports = {
    logIn,
    createUser,
    updateUser
};
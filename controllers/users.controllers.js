const Users = require('../models/User.js');

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.getUser(email);

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

exports.createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm } = req.body;
        const checkUser = await Users.getUser(email);

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

        Users.createUser(first_name, last_name, email, password);
        res.redirect('/login');
    } catch (error) {
        res.render('../views/pages/register.ejs', {error: error});
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm } = req.body;
        const checkUser = await Users.getUser(email);

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

        Users.updateUser(first_name, last_name, email, password);
        res.redirect('/account');
    } catch (error) {
        res.render('../views/pages/account.ejs', {error: error});
    }
}

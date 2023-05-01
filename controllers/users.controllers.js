const Users = require('../models/User.js');
const { validateLogIn, validateCreate, validateUpdate } = require('../helpers/validators/users.validator');
const bcrypt = require('bcrypt');

exports.renderLogIn = (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.render('../views/pages/login.ejs', {error: ''});
}

exports.logIn = async (req, res) => {
    const reqUser = req.body;
    const dbUser = await Users('get', {email: reqUser.email});
    const validate = await validateLogIn(reqUser, dbUser);

    if (validate !== true) {
        res.render('../views/pages/login.ejs', {error: validate});
        return;
    } else {
        req.session.loggedin = true;
        req.session.user = dbUser;
        res.redirect('/');
    }
}

exports.renderRegister = (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.render('../views/pages/register.ejs', {error: ''});
}

exports.createUser = async (req, res) => {
    const reqUser = req.body;
    const dbUser = await Users('get', {email: reqUser.email});
    const validate = validateCreate(reqUser, dbUser);

    if (validate !== true) {
        res.render('../views/pages/register.ejs', {error: validate});
        return;
    } else {
        const salt = await bcrypt.genSalt(10);
        reqUser.password = await bcrypt.hash(reqUser.password, salt);
        Users('create', {name: reqUser.name, email: reqUser.email, password: reqUser.password});
        res.redirect('/login');
    }
}

exports.renderAccount = (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('../views/pages/account.ejs', { error: '' });
}

exports.updateUser = async (req, res) => {
    const reqUser = req.body;
    const dbUser = await Users('get', {email: reqUser.email});
    const validate = validateUpdate(reqUser, dbUser, req.session.user.email);

    if (validate !== true) {
        res.render('../views/pages/account.ejs', {error: validate});
        return;
    } else {
        await Users('update', {name: reqUser.name, email: reqUser.email, password: reqUser.password});
        req.session.user = await Users('get', {email: reqUser.email});
        res.redirect('/account');
    }
}

exports.deleteUser = async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    await Users('delete', {email: req.session.user.email});
    req.session.destroy();
    res.redirect('/register');
}

exports.logOut = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

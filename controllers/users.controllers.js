const Users = require('../models/User.js');
const { validateLogIn, validateCreate, validateUpdate } = require('../helpers/validators/users.validator');

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
    const validate = validateLogIn(reqUser, dbUser);

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
        Users('create', {first_name: reqUser.first_name, last_name: reqUser.last_name, email: reqUser.email, password: reqUser.password});
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
        await Users('update', {first_name: reqUser.first_name, last_name: reqUser.last_name, email: reqUser.email, password: reqUser.password});
        req.session.user = await Users('get', {email: reqUser.email});
        res.redirect('/account');
    }
}

exports.logOut = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

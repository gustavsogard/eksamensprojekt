const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');

router.get('/', (req, res) => {
    res.render('../views/pages/index.ejs', { title: '' });
});

router.route('/register')
    .get((req, res) => {
        if (req.session.loggedin) {
            res.redirect('/');
            return;
        }
        res.render('../views/pages/register.ejs', {error: ''});
    })
    .post((req, res) => {
        usersController.createUser(req, res);
    });

router.route('/login')
    .get((req, res) => {
        if (req.session.loggedin) {
            res.redirect('/');
            return;
        }
        res.render('../views/pages/login.ejs', {error: ''});
    })
    .post((req, res) => {
        usersController.logIn(req, res);
    });

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.route('/account')
    .get((req, res) => {
        if (!req.session.loggedin) {
            res.redirect('/login');
            return;
        }
        res.render('../views/pages/account.ejs', { error: '' });
    })
    .post((req, res) => {
        usersController.updateUser(req, res);
    });

module.exports = router;
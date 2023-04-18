const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');

router.get('/', (req, res) => {
    res.render('../views/pages/index.ejs');
});

router.route('/register')
    .get((req, res) => {
        usersController.renderRegister(req, res);
    })
    .post((req, res) => {
        usersController.createUser(req, res);
    });

router.route('/login')
    .get((req, res) => {
        usersController.renderLogIn(req, res);
    })
    .post((req, res) => {
        usersController.logIn(req, res);
    });

router.get('/logout', (req, res) => {
    usersController.logOut(req, res);
});

router.route('/account')
    .get((req, res) => {
        usersController.renderAccount(req, res);
    })
    .post((req, res) => {
        usersController.updateUser(req, res);
    })

router.route('/account/delete')
    .get((req, res) => {
        usersController.deleteUser(req, res);
    });

module.exports = router;
// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');


// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

//Route, der renderer opret bruger siden og opretter brugeren
router.route('/register')
    .get((req, res) => {
        usersController.renderRegister(req, res);
    })
    .post((req, res) => {
        usersController.createUser(req, res);
    });

//Router, der henter login-siden og logger brugeren ind
router.route('/login')
    .get((req, res) => {
        usersController.renderLogIn(req, res);
    })
    .post((req, res) => {
        usersController.logIn(req, res);
    });

//Route, der logger brugeren ud
router.get('/logout', (req, res) => {
    usersController.logOut(req, res);
});

//Route, der renderer brugerens profil som opdaterer brugeren
router.route('/account')
    .get((req, res) => {
        usersController.renderAccount(req, res);
    })
    .post((req, res) => {
        usersController.updateUser(req, res);
    })

//Route, der fjerner brugeren
router.route('/account/delete')
    .get((req, res) => {
        usersController.deleteUser(req, res);
    });

//Vi eksporterer routes så de kan anvendes i controlleren
module.exports = router;
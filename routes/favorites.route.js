// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controllers.js');

// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

//Route, der renderer favoritartikler
router.route('/favorites')
    .get((req, res) => {
        favoritesController.renderFavorites(req, res);
    })

//Route, der tilføjer en kategori som favorit
router.route('/favorites/categories/:id/addFavorite')
    .get((req, res) => {
        favoritesController.addFavoriteCategory(req, res);
    })

//Route, der fjerner en kategori som favorit
router.route('/favorites/categories/:id/removeFavorite')
    .get((req, res) => {
        favoritesController.removeFavoriteCategory(req, res);
    })

//Route, der henter flere favoritartikler (såfremt de findes)
router.route('/favorites/loadmore/:page')
    .get((req, res) => {
        favoritesController.loadMoreFavorites(req, res);
    })

//Vi eksporterer routes så de kan anvendes i controlleren
module.exports = router;
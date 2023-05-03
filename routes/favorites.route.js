const express = require('express');
const router = express.Router();

const favoritesController = require('../controllers/favorites.controllers.js');

router.route('/favorites')
    .get((req, res) => {
        favoritesController.renderFavorites(req, res);
    })

router.route('/favorites/categories/:id/addFavorite')
    .get((req, res) => {
        favoritesController.addFavoriteCategory(req, res);
    })

router.route('/favorites/categories/:id/removeFavorite')
    .get((req, res) => {
        favoritesController.removeFavoriteCategory(req, res);
    })

router.route('/favorites/loadmore/:page')
    .get((req, res) => {
        favoritesController.loadMoreFavorites(req, res);
    })

module.exports = router;
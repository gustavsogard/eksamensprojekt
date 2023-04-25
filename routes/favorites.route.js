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

module.exports = router;
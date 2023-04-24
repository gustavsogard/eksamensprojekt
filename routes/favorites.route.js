const express = require('express');
const router = express.Router();

const favoritesController = require('../controllers/favorites.controllers.js');

router.route('/favorites')
    .get((req, res) => {
        favoritesController.renderFavorites(req, res);
    })

module.exports = router;
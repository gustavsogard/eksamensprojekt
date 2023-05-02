const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controllers');

router.route('/category/:id')
    .get((req, res) => {
        categoriesController.renderCategory(req, res);
    })

router.route('/category/:id/loadmore/:page')
    .get((req, res) => {
        categoriesController.loadMoreArticles(req, res);
    })

module.exports = router;
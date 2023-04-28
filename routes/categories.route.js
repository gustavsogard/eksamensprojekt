const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controllers');

router.route('/category/:id')
    .get((req, res) => {
        categoriesController.renderCategory(req, res);
    })

module.exports = router;
// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controllers');

// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

//Route, der henter kategorierne
router.route('/category/:id')
    .get((req, res) => {
        categoriesController.renderCategory(req, res);
    })

//Route, der indlæser flere artikler
router.route('/category/:id/loadmore/:page')
    .get((req, res) => {
        categoriesController.loadMoreArticles(req, res);
    })

//Vi eksporterer routes så de kan anvendes i controlleren
module.exports = router;
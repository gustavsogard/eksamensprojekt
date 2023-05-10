// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controllers')

// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

//Route, der henter artikler baseret på de parametrer brugeren søger efter.
router.route('/search')
    .post((req,res) => {
        searchController.renderSearch(req,res)
    })

//Route, der henter flere artikler baseret på hvad brugeren søger efter.
router.route('/search/loadmore/:page/:query/:publisher')
    .get((req, res) => {
        searchController.loadMoreSearch(req, res);
    })

//Vi eksporterer routes så de kan anvendes i controlleren
module.exports = router;
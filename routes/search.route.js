const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controllers')

router.route('/search')
    .post((req,res) => {
        searchController.renderSearch(req,res)
    })

router.route('/search/loadmore/:page/:query/:publisher')
    .get((req, res) => {
        searchController.loadMoreSearch(req, res);
    })

module.exports = router;
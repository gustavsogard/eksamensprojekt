const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controllers')

router.route('/search')
    .post((req,res) => {
        searchController.renderSearch(req,res)

    })

module.exports = router;
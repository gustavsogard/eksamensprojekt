const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controllers');

// Her bliver 'root-route' defineret. Det betyder bare index siden. 
router.get('/', (req, res) => {
    // renderIndex funktionen bliver kaldt
    indexController.renderIndex(req, res);
});

module.exports = router;
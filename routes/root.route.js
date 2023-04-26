const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controllers');

router.get('/', (req, res) => {
    indexController.renderIndex(req, res);
});

module.exports = router;
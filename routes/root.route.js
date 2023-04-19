const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../views/pages/index.ejs');
});

module.exports = router;
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controllers')

router.route('/weather')
    .get((req,res) => {
        weatherController.renderWeather(req,res)
    })


module.exports = router
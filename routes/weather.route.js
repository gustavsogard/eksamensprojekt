const express = require('express');
const router = express.Router();
const weatherController = require('./weather.controllers.js')

router.route('/weather')
    .get((req,res) => {
        weatherController.renderWeather(req,res)
    })


module.exports = router
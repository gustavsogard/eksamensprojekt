// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controllers')

// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

//Route, der renderer vejret
router.route('/weather')
    .get((req,res) => {
        weatherController.renderWeather(req,res)
    })

//Vi eksporterer routes så de kan anvendes i controlleren
module.exports = router
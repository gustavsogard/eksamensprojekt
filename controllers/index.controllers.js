const Articles = require('../models/Articles.js');
const Weather = require('../models/Weather.js');
const { getCorrectIcon } = require('../helpers/validators/weather.validator');

exports.renderIndex = async (req, res) => {
    const articles = await Articles('get12', {page: 0});
    const weather_forecast = await Weather('getWeatherForecast');
    res.render('../views/pages/index.ejs', {articles: articles, weather_forecast: weather_forecast, getCorrectIcon});
}
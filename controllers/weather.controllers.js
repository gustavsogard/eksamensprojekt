const Weather = require('../models/Weather.js');

exports.renderWeather = async (req,res) => {
    const forecast = await Weather('getWeatherForecast')
    const historical = await Weather('getWeatherHistorical')
    console.log(forecast[0]);
    console.log(historical[0]);
    res.render('../views/pages/article.ejs', {forecast: forecast.degrees[0], historical: historical.degrees[0]})
}
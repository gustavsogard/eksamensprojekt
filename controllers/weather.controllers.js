const Weather = require('../models/Weather.js');

exports.renderWeather = async (req, res) => {
  const forecast = await Weather('getWeatherForecast');
  const historical = await Weather('getWeatherHistorical');
  res.render('../views/pages/weather.ejs', { forecast: forecast, historical: historical});
};


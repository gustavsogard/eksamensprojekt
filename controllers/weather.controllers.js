//Henter weather-modellen og helper-funktionen til vejrikonerne
const Weather = require('../models/Weather.js');
const { getCorrectIcon } = require('../helpers/validators/weather.validator');

//Definerer renderWeather-funktionen
exports.renderWeather = async (req, res) => {
  //Henter vejrudsigten og de historiske vejrdata ved hjælp af Weather modellen
  const forecast = await Weather('getWeatherForecast');
  const historical = await Weather('getWeatherHistorical');
  
  //Renderer vejrsiden og vedlægger vejrudsigt, historisk vejrdata og helper-funktionen
  res.render('../views/pages/weather.ejs', { forecast: forecast, historical: historical, getCorrectIcon});
};

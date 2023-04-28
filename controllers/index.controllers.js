const Articles = require('../models/Articles.js');
const Weather = require('../models/Weather.js');
const Categories = require('../models/Categories.js');
const { getCorrectIcon } = require('../helpers/validators/weather.validator');

exports.renderIndex = async (req, res) => {
    let user_id = undefined;

    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }

    const articles = await Articles('get12', {page: 0});
    const weather_forecast = await Weather('getWeatherForecast');
    const categories = await Categories('getAll', {user_id: user_id});

    res.render('../views/pages/index.ejs', {articles: articles, weather_forecast: weather_forecast, getCorrectIcon, categories: categories});
}

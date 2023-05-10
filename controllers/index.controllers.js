//Relevant Models bliver hentet samt hjælper-funktion
const Articles = require('../models/Articles.js');
const Weather = require('../models/Weather.js');
const Categories = require('../models/Categories.js');
const { getCorrectIcon } = require('../helpers/validators/weather.validator');

//Definerer indeks-funktion
exports.renderIndex = async (req, res) => {
    //Laver en variabel der holder øje med hvilken bruger der er logget ind. Sættes som undefined
    let user_id = undefined;
    //Hvis en bruger er logget ind gemmes id på brugeren i user_id variablen
    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }

    //Henter artikler, vejret og brugerens favoritkategorier fra modellerne
    const articles = await Articles('get12', {page: 0});
    const weather_forecast = await Weather('getWeatherForecast');
    const categories = await Categories('getAll', {user_id: user_id});

    //Renderer indekssiden ved at vedlægge artikler, vejret, kategorier og helper-funktion til vejr-ikoner
    res.render('../views/pages/index.ejs', {articles: articles, weather_forecast: weather_forecast, getCorrectIcon, categories: categories});
}

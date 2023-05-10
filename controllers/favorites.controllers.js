//Henter relevante Models
const Categories = require('../models/Categories.js');
const Articles = require('../models/Articles.js');

// renderFavorites funktionen bliver lavet
exports.renderFavorites = async (req, res) => {
    // user_id bliver sat til undefined
    let user_id = undefined;
    // favorite articles bliver sat til et tomt array
    let favorite_articles = [];
    // hvis der eksisterer en session bliver user_id sat til den nuværende brugers id
    if (req.session.loggedin) {
        user_id = req.session.user.id;
        favorite_articles = await Articles('getFavorite12ByUserId', {user_id: user_id, page: 0});
    }
    // categories modellen bliver kaldt med opreationen 'getAll', for at loade alle artiklerne brugeren har liket.
    // det bliver gjort ved at give brugerens id med
    const categories = await Categories('getAll', {user_id: user_id});
    // Favorites siden bliver renderet med favorit artiklerne
    res.render('../views/pages/favorites.ejs', {categories: categories, articles: favorite_articles});
}
// addFavoriteCategory funktionen bliver lavet
exports.addFavoriteCategory = async (req, res) => {
    // hvis brugeren er logget ind bliver artiklen tilføjet til favoritterne
    if (req.session.loggedin) {
        await Categories('addFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return;
    }
}

exports.removeFavoriteCategory = async (req, res) => {
    // hvis brugeren er logget ind bliver artiklen fjernet fra favoritterne
    if (req.session.loggedin) {
        await Categories('removeFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return;
    }
}
// loadMoreArticles funktionen bliver lavet
exports.loadMoreFavorites = async (req, res) => {
    // articles bliver defineret som de næste 12 favorit artikler der bliver hentet
    // det bliver gjort ved hjælp af at sende brugerens id med. 
    const articles = await Articles('getFavorite12ByUserId', {user_id: req.session.user.id, page: req.params.page});
    // det bliver renderet som JSON
    res.json(articles);
}
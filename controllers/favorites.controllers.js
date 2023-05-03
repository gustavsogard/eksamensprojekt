const Categories = require('../models/Categories.js');
const Articles = require('../models/Articles.js');

exports.renderFavorites = async (req, res) => {
    let user_id = undefined;
    let favorite_articles = [];

    if (req.session.loggedin) {
        user_id = req.session.user.id;
        favorite_articles = await Articles('getFavorite12ByUserId', {user_id: user_id, page: 0});
    }

    const categories = await Categories('getAll', {user_id: user_id});
    res.render('../views/pages/favorites.ejs', {categories: categories, articles: favorite_articles});
}

exports.addFavoriteCategory = async (req, res) => {
    if (!req.session.loggedin) {
        console.log("You are not logged in") //Find anden løsning her
    } else {
        await Categories('addFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return
    }
}

exports.removeFavoriteCategory = async (req, res) => {
    if (!req.session.loggedin) {
        console.log("You are not logged in"); //Find anden løsning her
    } else {
        await Categories('removeFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return
    }
}

exports.loadMoreFavorites = async (req, res) => {
    const articles = await Articles('getFavorite12ByUserId', {user_id: req.session.user.id, page: req.params.page});
    res.json(articles);
}
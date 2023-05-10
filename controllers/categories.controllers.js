//Henter anvendte modeller
const Articles = require('../models/Articles.js');
const Categories = require('../models/Categories.js');

// renderCategory funktionen bliver lavet
exports.renderCategory = async (req, res) => {
    // user_id bliver sat til undefined
    let user_id = undefined;
    // hvis der eksisterer en session bliver user_id sat til den nuværende brugers id
    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }

    // article bliver defineret som et objekt med de 12 artikler der bliver returneret fra Articles modellen, når operationen 'get12ByCategoryId' bliver sendt.
    // Der bliver også sendt id med, fra params, for at søge på artikel id'et. 
    const articles = await Articles('get12ByCategoryId', {category_id: req.params.id, page: 0});
    // Der bliver hentet alle kategorier fra categories og kategorierne som brugeren har sat som favoritter
    const categories = await Categories('getAll', {user_id: user_id});
    // category siden bliver vist med artiklerne, og kategorierne 
    res.render('../views/pages/category.ejs', {articles: articles, categories: categories, category_id: req.params.id});
}
// loadMoreArticles funktionen bliver lavet
exports.loadMoreArticles = async (req, res) => {
    // articles bliver defineret som den næste 12 artikler der bliver hentet
    const articles = await Articles('get12ByCategoryId', {category_id: req.params.id, page: req.params.page});
    // det bliver renderet som JSON
    res.json(articles);
}
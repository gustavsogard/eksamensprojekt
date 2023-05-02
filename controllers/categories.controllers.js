const Articles = require('../models/Articles.js');
const Categories = require('../models/Categories.js');

exports.renderCategory = async (req, res) => {
    let user_id = undefined;

    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }

    const articles = await Articles('get12ByCategoryId', {category_id: req.params.id, page: 0});
    const categories = await Categories('getAll', {user_id: user_id});

    res.render('../views/pages/category.ejs', {articles: articles, categories: categories, category_id: req.params.id});
}

exports.loadMoreArticles = async (req, res) => {
    const articles = await Articles('get12ByCategoryId', {category_id: req.params.id, page: req.params.page});
    res.json(articles);
}
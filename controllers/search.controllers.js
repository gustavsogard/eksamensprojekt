const Search = require('../models/Search.js');


exports.renderSearch = async (req, res) => {
    const articles = await Search('search', {keyWord: req.body.query, publisher: req.body.publisher, page: 0})
    res.render('../views/pages/search.ejs', {articles: articles});
}
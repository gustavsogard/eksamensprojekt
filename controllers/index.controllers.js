const Articles = require('../models/Articles.js');

exports.renderIndex = async (req, res) => {
    const articles = await Articles('get12', {page: 0});

    res.render('../views/pages/index.ejs', {articles: articles});
}
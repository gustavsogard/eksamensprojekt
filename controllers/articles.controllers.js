const Articles = require('../models/Articles.js');

exports.renderArticle = async (req,res) => {
    const article = await Articles('getById', {id: req.params.id})
    res.render('../views/pages/article.ejs')
}
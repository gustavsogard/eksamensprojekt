const Articles = require('../models/Articles.js');
const Comments = require('../models/Comments.js');

exports.renderArticle = async (req,res) => {
    const article = await Articles('getById', {id: req.params.id});
    const comments = await Comments('getAllByArticleId', {article_id: req.params.id});
    res.render('../views/pages/article.ejs', {article: article[0], comments: comments});
}

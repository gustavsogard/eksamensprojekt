const Articles = require('../models/Articles.js');
const Comments = require('../models/Comments.js');

exports.renderArticle = async (req,res) => {
    const article = await Articles('getById', {id: req.params.id});
    const comments = await Comments('getAllByArticleId', {article_id: req.params.id});
    console.log(article[0]);
    res.render('../views/pages/article.ejs', {article: article[0], comments: comments});
}

exports.readArticle = async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/article/' + req.params.id);
    } else {
        await Articles('read', {article_id: req.params.id, user_id: req.session.user.id});
        res.redirect('/article/' + req.params.id);
    }
}

exports.addFavoriteArticle = async (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/article/' + req.params.id);
    } else {
        await Articles('addFavorite', {article_id: req.params.id, user_id: req.session.user.id});
        res.redirect('/article/' + req.params.id);
    }
}

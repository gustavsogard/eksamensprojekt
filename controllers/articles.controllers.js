const Articles = require('../models/Articles.js');
const Comments = require('../models/Comments.js');

exports.renderArticle = async (req,res) => {
    let user_id = undefined;

    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }

    const article = await Articles('getById', {id: req.params.id, user_id: user_id});
    const comments = await Comments('getAllByArticleId', {article_id: req.params.id});
    res.render('../views/pages/article.ejs', {article: article[0], comments: comments});
}

exports.readArticle = async (req, res) => {
    console.log('trying to add to read...');
    if (!req.session.loggedin) {
        return;
    } else {
        await Articles('read', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}

exports.addFavoriteArticle = async (req, res) => {
    if (!req.session.loggedin) {
        return;
    } else {
        await Articles('addFavorite', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}

exports.removeFavoriteArticle = async (req, res) => {
    if (!req.session.loggedin) {
        return;
    } else {
        await Articles('removeFavorite', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}

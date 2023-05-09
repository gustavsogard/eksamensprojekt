const Articles = require('../models/Articles.js');
const Comments = require('../models/Comments.js');

// renderArticle funktionen bliver lavet
exports.renderArticle = async (req,res) => {
    // user_id bliver sat til undefined
    let user_id = undefined;
    // hvis der eksisterer en session bliver user_id sat til den nuværende brugers id
    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }
    // article bliver defineret som den artikel der bliver returneret fra Articles modellen, når operationen 'getByID' bliver sendt.
    // Der bliver også sendt id med, fra params, for at søge på artikel id'et. 
    const article = await Articles('getById', {id: req.params.id, user_id: user_id});
    // der bliver hentet kommentarer der hører til artiklen
    const comments = await Comments('getAllByArticleId', {article_id: req.params.id});
    // siden bliver renderet med artiklen og mulige kommentarer
    res.render('../views/pages/article.ejs', {article: article[0], comments: comments});
}

// read article funktionen bliver lavet
exports.readArticle = async (req, res) => {
    // hvis der ikke eksister en session skal der ikke ske noget
    if (!req.session.loggedin) {
        return;
    // hvis der eksister en session bliver de læste artikler hentet
    } else {
        await Articles('read', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}
// addFavoriteArticle funktionen bliver lavet
exports.addFavoriteArticle = async (req, res) => {
    // hvis der ikke eksister en session skal der ikke ske noget
    if (!req.session.loggedin) {
        return;
    // hvis der eksister en session bliver den valgte artikel tilføjet til favoritter
    } else {
        await Articles('addFavorite', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}
// removeFavoriteArticle funktionen bliver lavet
exports.removeFavoriteArticle = async (req, res) => {
    // hvis der ikke eksister en session skal der ikke ske noget
    if (!req.session.loggedin) {
        return;
    // hvis der eksister en session bliver den valgte artikel fjernet fra favoritter
    } else {
        await Articles('removeFavorite', {article_id: req.params.id, user_id: req.session.user.id});
        return;
    }
}
// loadMoreArticles funktionen bliver lavet
exports.loadMoreArticles = async (req, res) => {
    // articles bliver defineret som den næste 12 artikler der bliver hentet
    const articles = await Articles('get12', {page: req.params.page});
    // det bliver renderet som JSON
    res.json(articles);
}

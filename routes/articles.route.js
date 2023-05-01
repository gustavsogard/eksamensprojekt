// Her ville der være en dynamisk route til en enkelt artikel (/artikel/:id)
// Der vil også være en post route til at tilføje en kommentar til den enkelte artikel
const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controllers');
const commentsController = require('../controllers/comments.controllers');

router.route('/article/:id')
    .get((req, res) => {
      articlesController.renderArticle(req, res);
    })
    .post((req,res) => {
      commentsController.createComment(req, res);
    })

router.route('/article/:id/read')
    .get((req, res) => {
      articlesController.readArticle(req, res);
    });

router.route('/article/:id/favorite')
    .get((req, res) => {
      articlesController.addFavoriteArticle(req, res);
    })

router.route('/article/:id/removeFavorite')
    .get((req, res) => {
      articlesController.removeFavoriteArticle(req, res);
    })

router.route('/articles/loadmore/:page')
    .get((req, res) => {
      articlesController.loadMoreArticles(req, res);
    })

module.exports = router;
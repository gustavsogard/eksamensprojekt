// Vi definerer express, controllerne og router'en
const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controllers');
const commentsController = require('../controllers/comments.controllers');

// Herunder defineres alle routes med .route og derefter de request typer der er mulige og henviser til de korrekte controllers

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
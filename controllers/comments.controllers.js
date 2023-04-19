const Comments = require('../models/Comments.js');

exports.createComment = async (req,res) => {
    await Comments('create', {content: req.body.comment, user_id: req.session.user.id, article_id: req.params.id});
    res.redirect('/article/' + req.params.id);
}
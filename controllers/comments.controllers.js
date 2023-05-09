const Comments = require('../models/Comments.js');
// createComment funktionen bliver lavet
exports.createComment = async (req,res) => {
    // Comments modellen bliver kaldt med operationen 'create', som laver en ny kommentar. 
    // Der bliver medtaget brugerens id, hvad der er skrevet i kommentaren og hviken artikel der er blevet skrevet en kommentar til
    await Comments('create', {content: req.body.comment, user_id: req.session.user.id, article_id: req.params.id});
    // Der bliver redirected til den side brugeren allerede er på, for at vise den nye kommentar brugeren har skrevet
    res.redirect('/article/' + req.params.id);
}
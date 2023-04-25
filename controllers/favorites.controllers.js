const Categories = require('../models/Categories.js');

exports.renderFavorites = async (req, res) => {
    const categories = await Categories('getAll');
    res.render('../views/pages/favorites.ejs', {categories: categories});
}

exports.addFavoriteCategory = async (req, res) => {
    if (!req.session.loggedin) {
        console.log("You are not logged in") //Find anden løsning her
    } else {
        await Categories('addFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        res.redirect('/favorites');
    }
}
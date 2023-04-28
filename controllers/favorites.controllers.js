const Categories = require('../models/Categories.js');

exports.renderFavorites = async (req, res) => {
    let user_id = undefined;

    if (req.session.loggedin) {
        user_id = req.session.user.id;
    }
    const categories = await Categories('getAll', {user_id: user_id});
    res.render('../views/pages/favorites.ejs', {categories: categories});
}

exports.addFavoriteCategory = async (req, res) => {
    if (!req.session.loggedin) {
        console.log("You are not logged in") //Find anden løsning her
    } else {
        await Categories('addFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return
    }
}

exports.removeFavoriteCategory = async (req, res) => {
    if (!req.session.loggedin) {
        console.log("You are not logged in"); //Find anden løsning her
    } else {
        await Categories('removeFavorite', {user_id: req.session.user.id, category_id: req.params.id});
        return
    }
}
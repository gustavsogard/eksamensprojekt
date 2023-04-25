const Categories= require('../models/Categories.js');

exports.renderFavorites = async (req, res) => {
    const categories = await Categories('getAll');
    res.render('../views/pages/favorites.ejs', {categories: categories});
}
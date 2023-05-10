//Henter search modellen
const Search = require('../models/Search.js');

//Definerer renderSearch-funktion
exports.renderSearch = async (req, res) => {
    //Henter artikler fra modellen med de parametre som brugeren har søgt efter, samt nummer på pagination
    const articles = await Search('search', {keyWord: req.body.query, publisher: req.body.publisher, page: 0});
    //Renderer search-siden ved at vedlægge de artikler der blev fundet i databasen
    res.render('../views/pages/search.ejs', {articles: articles, query: req.body.query, publisher: req.body.publisher});
}

//Definerer loadMoreSearch-funktion
exports.loadMoreSearch = async (req, res) => {
    //Henter flere artikler baseret på de parametre brugeren søger efter + det sidenummer brugeren er på.
    const articles = await Search('search', {keyWord: req.params.query, publisher: req.params.publisher, page: req.params.page});
    //Sender artiklerne videre til siden
    res.json(articles);
}
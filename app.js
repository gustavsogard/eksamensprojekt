// Vi inddrager de vigtigste modules og initierer express som app
const express = require('express');
const app = express();
const session = require('express-session');

const port = 4000;

// Nu sætter vi view engine til ejs og gør public mappen tilgængelig på "/public"
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// Her gør vi serveren i stand til at læse requests' body's
app.use(express.urlencoded({extended: true}));

// Der tændes en session med .use
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Denne middleware funktion sørger for at ejs filerne altid har adgang til user objektet
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.currentPage = req.path;
  next();
});

// Nu defineres alle routes
const root = require('./routes/root.route');
app.use('/', root);

const articles = require('./routes/articles.route');
app.use('/', articles);

const weather = require('./routes/weather.route')
app.use('/', weather)

const user = require('./routes/user.route');
app.use('/', user);

const favorites = require('./routes/favorites.route');
app.use('/', favorites);

const categories = require('./routes/categories.route')
app.use('/', categories)

const search = require('./routes/search.route');
app.use('/', search);

// Vi lytter på porten
app.listen(port, () => {
    console.log(`Running on port: ${port}`);
});

const express = require('express');
const app = express();
const session = require('express-session');

const port = 4000;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

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

app.listen(port, () => {
    console.log(`Running on port: ${port}`);
});

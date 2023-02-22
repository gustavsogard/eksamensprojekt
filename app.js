const express = require('express');
const app = express();
const session = require('express-session');

const port = 3000;

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

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

const path = require('path');
const bodyparser = require("body-parser");
const express = require('express');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const db = require('./db.js')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = 'localhost';

require('dotenv').config();

const session = require('express-session');

app.use(cookieParser())

app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*1000,
        httpOnly: false
    }
}))

app.use(session({
    resave: false,
    secret: "queazy's secret",
    saveUninitialized: false
}));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Handlebars.registerHelper('ifEquals', function(comparand, options) {
    //console.log(comparand);
    //console.log(options.hash.value);
    return (comparand == options.hash.value) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('unlessEquals', function(comparand, options) {
    //console.log(comparand);
    //console.log(options.hash.value);
    return (comparand != options.hash.value) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('concat', function(val1, val2) {
    return ('' + val1) + val2;
});

Handlebars.registerHelper('inc', function(number) {
    if (number instanceof Number) return number + 1;
    return Number.parseInt(number) + 1;
});

Handlebars.registerHelper('boolValue', function(value) {
    return value ? 'True' : 'False';
});

Handlebars.registerHelper('countQuestions', function(value) {
    return value.length !== 1 ? `${value.length} Questions` : '1 Question';
});

Handlebars.registerHelper('countPlays', function(value) {
    return value !== 1 ? `${value} Plays` : '1 Play';
});

Handlebars.registerHelper('createTime', function(value) {
    var seconds = value % 60;
    value = Math.floor(value / 60);
    var minutes = value % 60;
    var hours = Math.floor(value / 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
});

Handlebars.registerHelper('encodeURI', function(value) {
    return encodeURIComponent(value);
});

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));

const answerRoutes = require('./routes/answer');
const authRoutes = require('./routes/auth');
const genreRoutes = require('./routes/genre');
const profileRoutes = require('./routes/profile');
const quizRoutes = require('./routes/quiz');
const siteRoutes = require('./routes/site');

const loadGenres = require('./middleware/load-genres');

app.use(loadGenres);

app.use(answerRoutes);
app.use(authRoutes);
app.use(genreRoutes);
app.use(profileRoutes);
app.use(quizRoutes);
app.use(siteRoutes);

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@quezy.odeny.mongodb.net/quezy?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

app.listen(PORT, HOSTNAME, () => {
    console.log(`its working`);
});
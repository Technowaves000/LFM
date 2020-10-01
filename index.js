const path = require('path');
const bodyparser = require("body-parser");
const express = require('express');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const HOSTNAME = 'localhost';

const session = require('express-session');

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

// app.get('/create', (req, res) => {
//     return res.render('create-quiz', {
//         title: 'Create quiz'
//     });

mongoose.connect('mongodb://localhost:27017/queazy', {
    useNewUrlParser: true,
  });
  
  
  //Create quiz Form
  app.post("/create", (req, res) => {
      console.log(req.body);
      var title = req.body.title;
      var genre = req.body.genre;
      var time = req.body.time;
      var quiz = new Quiz({
          Title: title,
          Genre: genre,
          Time: time
      
      })
  
  
       quiz.save().then((doc)=>{
       console.log("Successfully added: "+ doc);
       //alert("Quiz Created");
   }, (err)=>{
       console.log("Error in adding: " + err);
       //alert("Error in creating Quiz");
  
   })
  
  })

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

app.listen(PORT, HOSTNAME, () => {
    console.log(`its working`);
});
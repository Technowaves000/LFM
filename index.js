const path = require('path');
const bodyparser = require("body-parser")
const express = require('express');
const Handlebars = require('handlebars');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const HOSTNAME = 'localhost';

const urlencoder = bodyparser.urlencoded({
    extended: false
  })

  mongoose.connect('mongodb://localhost:27017/queazy', {
    useNewUrlParser: true,
  })
  
  
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

Handlebars.registerHelper('ifEquals', function(comparand, options) {
    console.log(comparand);
    console.log(options.hash.value);
    return (comparand == options.hash.value) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('concat', function(val1, val2) {
    return ('' + val1) + val2;
});

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.get('/create', (req, res) => {
    return res.render('create-quiz', {
        title: 'Create quiz'
    });
});

app.get('/edit/:quizId', (req, res) => {
    if (req.params.quizId % 2 == 0) {
        var items = [
            {
                id: 1,
                text: 'Lorem Ipsum 1',
                answer: true
            },
            {
                id: 2,
                text: 'Lorem Ipsum 2',
                answer: true
            },
            {
                id: 3,
                text: 'Lorem Ipsum 3',
                answer: false
            }
        ];
    
        return res.render('edit-quiz', {
            title: 'Edit quiz',
            quizTitle: 'Title of your *** tape',
            time: 60,
            genreCode: 5,
            typeCode: 'torf',
            items: items
        });
    } else {
        var items = [
            {
                id: 1,
                text: 'Lorem Ipsum 1',
                answer: 'abc'
            },
            {
                id: 2,
                text: 'Lorem Ipsum 2',
                answer: 'def'
            },
            {
                id: 3,
                text: 'Lorem Ipsum 3',
                answer: 'ghi'
            }
        ];
    
        return res.render('edit-quiz', {
            title: 'Edit quiz',
            quizTitle: 'Title of your *** tape',
            time: 60,
            genreCode: 5,
            typeCode: 'fill',
            items: items
        });
    }
});

app.get('/category/:category', (req, res) => {
    var name = 'Sample Category';
    var results = [
        {
            title: 'Title 1',
            author: 'xyz',
            content: 'Lorem Ipsum 1'
        },
        {
            title: 'Title 2',
            author: 'abc',
            content: 'Lorem Ipsum 2'
        },
        {
            title: 'Title 3',
            author: 'def',
            content: 'Lorem Ipsum 3'
        }
    ]

    return res.render('category', {
        title: name,
        category: name,
        results: results,
        user: {
            username: 'test'
        }
    });
});

app.get('/quizzes', (req, res) => {
    var quizzes = [
        {
            id: 10,
            title: 'Title 1',
            content: 'Lorem Ipsum 1',
            likes: 10
        },
        {
            id: 11,
            title: 'Title 2',
            content: 'Lorem Ipsum 2',
            likes: 3
        },
        {
            id: 12,
            title: 'Title 3',
            content: 'Lorem Ipsum 3',
            likes: 15
        }
    ]

    return res.render('quizzes', {
        title: 'My Quizzes',
        quizzes: quizzes,
        user: {
            username: 'test'
        }
    });
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

app.get('/answer/:quizId', (req, res) => {
    var items = [
        {
            id: 1,
            text: 'Lorem Ipsum 1'
        },
        {
            id: 2,
            text: 'Lorem Ipsum 2'
        },
        {
            id: 3,
            text: 'Lorem Ipsum 3'
        }
    ];

    shuffle(items);
    for (var i = 0; i < items.length; i++) {
        items[i].first = i == 0;
        items[i].last = i == items.length - 1;
        items[i].fill = false;
        items[i].index = i + 1;
    }

    return res.render('answer', {
        title: 'Answer quiz',
        quizTitle: 'quiz title',
        quizId: req.params.quizId,
        user: {
            username: 'test'
        },
        time: 15,
        items: items
    });
});

app.post('/answer/:quizId', (req, res) => {
    return res.render('result', {
        title: 'Results for quiz ...',
        quizTitle: 'quiz title',
        quizId: req.params.quizId,
        score: 10,
        total: 20,
        canRetake: true,
        user: {
            username: 'test'
        }
    })
});

app.get('/profile/:user', (req, res) => {
    return res.render('view-profile', {
        title: req.params.user,
        user: {
            username: 'test'
        }
    });
});

app.get('/profile', (req, res) => {
    return res.render('view-profile', {
        title: 'test',
        user: {
            username: 'test'
        }
    });
});

app.get('/search', (req, res) => {
    var results = [
        {
            title: 'Title 1',
            author: 'xyz',
            content: 'Lorem Ipsum 1'
        },
        {
            title: 'Title 2',
            author: 'abc',
            content: 'Lorem Ipsum 2'
        },
        {
            title: 'Title 3',
            author: 'def',
            content: 'Lorem Ipsum 3'
        }
    ]

    return res.render('search', {
        title: 'Search results for ' + req.query.q,
        query: req.query.q,
        results: results,
        user: {
            username: 'test'
        }
    });
});

app.get('/editprofile', (req, res) => {
    return res.render('edit-profile', {
        title: 'Edit profile - test',
        user: {
            username: 'test'
        }
    });
});

app.get('/login', (req, res) => {
    return res.render('login', {
        layout: 'login',
        title: 'Login to Queazy'
    });
});

app.get('/register', (req, res) => {
    return res.render('register', {
        layout: 'login',
        title: 'Register to Queazy'
    });
});

app.get('/', (req, res) => {
    return res.render('index', {
        title: 'Queazy'
    });
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`Listening: connect to http://${HOSTNAME}:${PORT}`);
});

app.post("/register", urlencoder, (req,res)=>{
    req.session.username = req.body.username
  
    res.render("index.hbs", {
      username: req.session.username,
      layout: false
    })
  })

app.post("/login", urlencoder, (req,res)=>{
req.session.username = req.body.username

res.render("index.hbs", {
    username: req.session.username,
    layout: false
})
})

app.post("/logout", urlencoder, (req,res)=>{
    req.session.destroy()
    
    res.redirect("/")
  })


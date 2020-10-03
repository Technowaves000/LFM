// Routes that deal with general stuff that doesn't belong to any other category go here.

const express = require('express');
const Router = express.Router;

const router = Router();

const data = require('../data');

router.get('/search', (req, res) => {
    var query = req.query.q;
    var page = Number.parseInt(req.query.p);

    var itemsPerPage = 3;

    data.getQuizzes()
        .then(quizzes => {
            var pages = Math.ceil(quizzes.length / itemsPerPage);
            quizzes = quizzes.map(q => {
                q.plays = Math.floor(Math.random() * 100.0);
                return q;
            });
            quizzes = quizzes.sort((a, b) => -(a.plays > b.plays ? 1 : a.plays < b.plays ? -1 : 0));
            quizzes = quizzes.filter((_, index) => index >= (page - 1) * itemsPerPage && index < page * itemsPerPage);

            return res.render('search', {
                title: `${query} - Queazy`,
                genres: req.genres,
                quizzes,
                firstPage: page === 1,
                prevPage: page - 1,
                nextPage: page + 1,
                lastPage: page === pages || pages === 0,
                user: req.session ? req.session.user : null
            });
        })
        .catch(reason => {
            return res.render('search', {
                title: 'Hot Quizzes - Queazy',
                genres: req.genres,
                user: req.session ? req.session.user : null
            });
        });
});

router.get('/team', (req, res) => {
    return res.render('team', {
        title: 'The Queazy Team',
        genres: req.genres,
        user: req.session ? req.session.user : null
    });
});

router.get('/npm', (req, res) => {
    return res.render('npm', {
        title: 'npm packages used - Queazy',
        genres: req.genres,
        user: req.session ? req.session.user : null
    });
});

router.get('/', (req, res) => {
    // Keep the top eight genres
    var mainGenres = [...req.genres];
    mainGenres.splice(8);
    return res.render('index', {
        title: 'Queazy',
        mainGenres,
        genres: req.genres,
        user: req.session ? req.session.user : null
    });
});

module.exports = router;

// Routes that deal with quiz genres go here.

const express = require('express');
const Router = express.Router;

const router = Router();

const data = require('../data');

router.get('/genre/:genreID/:page', (req, res) => {
    var genreID = Number.parseInt(req.params.genreID);
    var page = Number.parseInt(req.params.page);

    var itemsPerPage = 3;

    Promise.all([ data.getGenre(genreID), data.getQuizzesByGenre(genreID) ])
        .then(([ genre, quizzes ]) => {
            var pages = Math.ceil(quizzes.length / itemsPerPage);
            quizzes = quizzes.map(q => {
                q.plays = Math.floor(Math.random() * 100.0);
                return q;
            });
            quizzes = quizzes.sort((a, b) => -(a.plays > b.plays ? 1 : a.plays < b.plays ? -1 : 0));
            quizzes = quizzes.filter((_, index) => index >= (page - 1) * itemsPerPage && index < page * itemsPerPage);

            return res.render('genre', {
                title: `${genre.name} - Queazy`,
                genres: req.genres,
                genre: {
                    id: genre.id,
                    name: genre.name
                },
                quizzes,
                firstPage: page === 1,
                prevPage: page - 1,
                nextPage: page + 1,
                lastPage: page === pages || pages === 0,
                user: req.session ? req.session.user : null
            });
        })
        .catch(reason => {
            console.log(reason);
            // TODO: handle error
        });
});

router.get('/genre/:genreID', (req, res) => {
    return res.redirect(`/genre/${req.params.genreID}/1`);
});

router.get('/genres', (req, res) => {
    return res.render('index', {
        title: 'Queazy',
        genres: req.genres,
        user: req.session ? req.session.user : null
    });
});

module.exports = router;

// TODO: LOAD DATA FROM DATABASE

const data = require('../data');

function loadGenres(req, res, next) {
    data.getGenres()
        .then(genres => {
            req.genres = genres;
            next();
        })
        .catch(reason => {
            res.redirect('/404');
        });
}

module.exports = loadGenres;

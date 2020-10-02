// Routes that deal with the viewing, creating and editing of quizzes go here.

const path = require('path');
const express = require('express');
const Router = express.Router;
const mongoose = require('mongoose');
const router = Router();
const db = require('../db.js')
const checkLoggedIn = require('../middleware/check-logged-in');

const Quiz = require('../models/Quiz.model.js');
 

const multer = require('multer');

const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'video/mp4',
    'video/mpeg'
];

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (validMimeTypes.includes(file.mimetype))
            return cb(null, true);
        else
            return cb(null, false);
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '/../uploads'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
});

const data = require('../data');
const { Console } = require('console');

router.get('/create', checkLoggedIn, (req, res) => {
    return res.render('create-quiz', {
        genres: req.genres,
        title: 'Create quiz',
        user: req.session ? req.session.user : null
    });
});

router.post('/create', checkLoggedIn, upload.array('files'), (req, res) => {
    // To allow sending of files while being able to upload arrays of questions,
    // the questions are encoded in JSON and sent in a question field in the
    // multipart/form-data request.

        console.log(req);
    var authorID = req.session.user.id;
    
    var genre = Number.parseInt(req.body.genre);
    var questions = JSON.parse(req.body.questions);
    var timeLimit = Number.parseInt(req.body.timeLimit);
    var title = req.body.title;
    var type = req.body.type;

    questions.map(value => {
        if (value.file !== -1) {
            value.file = req.files[value.file].filename;
        } else {
            value.file = null;
        }

        return value;
    });

    // Each entry has three properties:
    //   question - the text itself
    //   answer - if fill in the blanks, anything. if true or false, must be parsed into boolean
    //   file - index into file array: -1 means no file associated with question.

    var quiz = new Quiz({
       Title: title,
       Genre: genre,
       Type: type,
       Time: timeLimit,
       Questions: questions, //json
       Author: authorID
    });

    console.log("This are the values =" + questions);

    quiz.save()
        .then((doc) => {
            console.log("added to database");
            return res.status(200).json({
                message: 'Quiz successfully created',
                id: quiz.id
            });
        })
        .catch(reason => {
            console.log("failed to add to database");
            return res.status(500).json({
                message: 'Failed to create quiz',
                reason
            });
        });
});

router.get('/edit/:quizId', checkLoggedIn, (req, res) => {
    var id = Number.parseInt(req.params.quizId);
    data.getQuiz(id)
        .then(quiz => {
            // Ensure only the author can edit the quiz.
            if (quiz.authorID === req.session.user.id) {
                return res.render('edit-quiz', {
                    title: 'Edit quiz',
                    genres: req.genres,
                    quizTitle: quiz.title,
                    time: quiz.timeLimit,
                    genreCode: quiz.genre,
                    typeCode: quiz.type,
                    items: quiz.questions,
                    user: req.session.user
                });
            } else {
                return res.redirect('/403');
            }
        })
        .catch(reason => {
            return res.redirect('/404');
        });
});

router.post('/edit/:quizId', checkLoggedIn, upload.array('files'), (req, res) => {
    var id = req.params.quizId;
    var authorID = req.session.user.id;

    data.isAuthorOfQuiz(authorID, id)
        .then(result => {
            if (result) {
                var genre = Number.parseInt(req.body.genre);
                var questions = JSON.parse(req.body.questions);
                var timeLimit = Number.parseInt(req.body.timeLimit);
                var title = req.body.title;
                var type = req.body.type;
            
                questions.map(value => {
                    if (value.file !== -1) {
                        value.file = req.files[value.file].filename;
                    } else {
                        value.file = null;
                    }
            
                    return value;
                });
            
                var quiz = {
                    title,
                    genre,
                    type,
                    timeLimit,
                    questions,
                    authorID
                };

                return data.editQuiz(id, quiz);
            } else {
                throw new Error('User tried to edit another user\'s quiz.');
            }
        })
        .then(result => {
            return res.status(200).json({
                message: 'Quiz successfully modified'
            });
        })
        .catch(reason => {
            return res.status(400).json({
                message: 'Failed to edit quiz',
                reason
            });
        });
});

router.get('/quiz/:id', (req, res) => {
    var id = Number.parseInt(req.params.id);

    data.getQuiz(id)
        .then(quiz => Promise.all([ quiz, data.getGenre(quiz.genre), data.getProfile(quiz.authorID) ]))
        .then(([ quiz, genre, author ]) => {
            // TODO: get leaderboard, sorted according to the algorithm provided

            var leaderboard = [
                { name: 'user_12', score: 19, time: 54, plays: 1 }, // plays === retakes
                { name: 'user_82', score: 20, time: 21, plays: 3 },
                { name: 'user_26', score: 17, time: 23, plays: 2 },
                { name: 'user_85', score: 13, time: 47, plays: 2 },
                { name: 'user_24', score: 16, time: 124, plays: 1 },
                { name: 'user_64', score: 12, time: 53, plays: 1 },
                { name: 'user_23', score: 17, time: 52, plays: 2 },
            ];

            leaderboard = leaderboard.sort((a, b) => {
                if (a.plays > b.plays) return 1;
                else if (a.plays < b.plays) return -1;
                else {
                    if (a.score > b.score) return -1;
                    else if (a.score < b.score) return 1;
                    else {
                        if (a.time > b.time) return 1;
                        else if (a.time < b.time) return -1;
                        else return 0;
                    }
                }
            }).filter((_, index) => index < 5);

            return res.render('view-quiz', {
                title: quiz.title,
                genres: req.genres,
                quiz: {
                    id: quiz.id,
                    genre,
                    title: quiz.title,
                    type: quiz.type == 'torf' ? 'True / False' : 'Fill in the Blanks',
                    genreID: genre.id,
                    timeLimit: quiz.timeLimit,
                    items: quiz.questions,
                },
                leaderboard,
                author,
                plays: 0,
                played: false,
                user: req.session ? req.session.user : null
            });
        })
        .catch(reason => {
            return res.redirect('/404');
        });
});

router.get('/hot/:page', (req, res) => {
    var page = Number.parseInt(req.params.page);

    var itemsPerPage = 5;

    data.getQuizzes()
        .then(quizzes => {
            var pages = Math.ceil(quizzes.length / itemsPerPage);
            quizzes = quizzes.map(q => {
                q.plays = Math.floor(Math.random() * 100.0);
                return q;
            });
            quizzes = quizzes.sort((a, b) => -(a.plays > b.plays ? 1 : a.plays < b.plays ? -1 : 0));
            quizzes = quizzes.filter((_, index) => index >= (page - 1) * itemsPerPage && index < page * itemsPerPage);

            return res.render('hot', {
                title: 'Hot Quizzes - Queazy',
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
            return res.render('hot', {
                title: 'Hot Quizzes - Queazy',
                genres: req.genres,
                user: req.session ? req.session.user : null
            });
        });
});

router.get('/hot', (req, res) => {
    return res.redirect('/hot/1');
});

module.exports = router;

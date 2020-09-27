// Routes that deal with the answering of quizzes and displaying of results go here.

const path = require('path');
const express = require('express');
const Router = express.Router;

const router = Router();

const checkLoggedIn = require('../middleware/check-logged-in');

const data = require('../data');

router.get('/checkmedia/:quizId/:index', checkLoggedIn, (req, res) => {
    var index = Number.parseInt(req.params.index);
    data.getQuiz(Number.parseInt(req.params.quizId))
        .then(quiz => {
            if (index < 1 || index > quiz.questions.length) {
                return res.sendStatus(400);
            } else {
                var question = quiz.questions[index - 1];
                return res.status(200).json({
                    present: question.file !== null,
                    type: question.file ? path.extname(question.file) : null
                });
            }
        })
        .catch(reason => {
            return res.sendStatus(404);
        });
});

router.get('/media/:quizId/:index', checkLoggedIn, (req, res) => {
    var index = Number.parseInt(req.params.index);
    data.getQuiz(Number.parseInt(req.params.quizId))
        .then(quiz => {
            if (index < 1 || index > quiz.questions.length) {
                return res.sendStatus(400);
            } else {
                var question = quiz.questions[index - 1];
                if (question.file !== null) {
                    return res.sendFile(path.join(__dirname, '/../uploads', question.file));
                } else {
                    return res.sendStatus(204);
                }
            }
        })
        .catch(reason => {
            return res.sendStatus(404);
        });
});

router.get('/answer/:quizId', checkLoggedIn, (req, res) => {
    data.getQuiz(Number.parseInt(req.params.quizId))
        .then(quiz => {
            return res.render('answer', {
                title: 'Answer quiz',
                genres: req.genres,
                quiz,
                user: req.session.user
            });
        })
        .catch(reason => {
            return res.sendStatus(404);
        });
});

router.post('/answer/:quizId', checkLoggedIn, (req, res) => {
    // TODO: check the answers!
    // body is a json array where each element is like this:
    // { index, answer }
    // index = the index to the question that corresponds with the answer
    // answer = duh
    var quizID = Number.parseInt(req.params.quizId);
    var elapsed = req.body.elapsed;
    var items = req.body.items;

    data.getQuiz(quizID)
        .then(quiz => {
            var score = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var index = item.index;
                var answer = item.answer;

                if (quiz.type === 'fill') {
                    if (quiz.questions[index - 1].answer.toLowerCase() === answer.toLowerCase()) {
                        score++;
                    }
                } else {
                    if (quiz.questions[index - 1].answer === answer) {
                        score++;
                    }
                }
            }

            return data.addResult(quizID, req.session.user.id, score, elapsed);
        })
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(reason => {
            return res.status(500).json({
                message: reason
            });
        });
});

router.get('/result/:resultId', checkLoggedIn, (req, res) => {
    data.getResult(Number.parseInt(req.params.resultId))
        .then(result => {
            return res.render('result', {
                title: `Results for ${result.quizTitle} - Queazy`,
                quizTitle: result.quizTitle,
                quizId: result.quizID,
                score: result.score,
                total: result.total,
                elapsed: result.elapsed,
                canRetake: true,
                genres: req.genres,
                user: req.session.user
            });
        })
        .catch(reason => {

        });
});

module.exports = router;

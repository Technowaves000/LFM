// Routes that deal with logging and registration go here.

const express = require('express');
const Router = express.Router;

const userModel = require("../models/userModel")
const quizModel = require("../models/quizModel")
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = Router();

const upload = require('multer')();
const data = require('../data');

router.get('/login', (req, res) => {
    return res.render('login', {
        layout: 'login',
        returnUrl: req.query.returnUrl,
        title: 'Login to Queazy'
    });
});

router.post('/login', (req, res) => {
    var returnUrl = req.body.returnUrl || '/';
    
    // var username = req.body.username;
    // var password = req.body.password;

    var {username, password} = req.body;

    var username = userModel.findOne({Username: username});


    if (!username || !password) {
        return res.render('login', {
            layout: 'login',
            error: 'Username and password required.',
            title: 'Login to Queazy'
        });
    }

    if (username){
        bcrypt.compare(password, username.password, function(err, result){
            if(result){
                res.render('login', {
                    layout: 'login',
                    error: err,
                    title: 'Login to Queazy'
                 })
            }
        })
    }

    // data.authenticate(username, password)
    //     .then(user => {
    //         req.session.user = user;
    //         req.session.save(err => {
    //             if (err) {
    //                 return res.render('login', {
    //                     layout: 'login',
    //                     error: err,
    //                     title: 'Login to Queazy'
    //                 });
    //             } else {
    //                 return res.redirect(returnUrl);
    //             }
    //         });
    //     })
    //     .catch(reason => {
    //         return res.render('login', {
    //             layout: 'login',
    //             error: reason,
    //             title: 'Login to Queazy'
    //         });
    //     });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        return res.redirect('/');
    });
});

router.get('/register', (req, res) => {
    return res.render('register', {
        layout: 'login',
        title: 'Register to Queazy'
    });
});

router.post('/register', (req, res) => {
    var returnUrl = req.body.returnUrl || '/';
    
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.render('register', {
            layout: 'login',
            error: 'Username and password required.',
            title: 'Register to Queazy'
        });
    }

    else{
        bcrypt.hash(password, saltRounds, function(err, hash){
            userModel.insertOne({
                Username: username,
                Password: hash
            },function(err){
                if(!err)res.redirect("/")
            })
        })
    }

    // data.register(username, password)
    //     .then(user => {
    //         req.session.user = user;
    //         req.session.save(err => {
    //             if (err) {
    //                 return res.render('register', {
    //                     layout: 'login',
    //                     error: err,
    //                     title: 'Register to Queazy'
    //                 });
    //             } else {
    //                 return res.redirect(returnUrl);
    //             }
    //         });
    //     })
    //     .catch(reason => {
    //         return res.render('register', {
    //             layout: 'login',
    //             error: reason,
    //             title: 'Register to Queazy'
    //         });
    //     });
});

module.exports = router;

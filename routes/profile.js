// Routes that deal with viewing and editing profiles go here

const path = require('path');
const express = require('express');
const Router = express.Router;

const router = Router();

const data = require('../data');
const checkLoggedIn = require('../middleware/check-logged-in');

const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '/../uploads') });

router.get('/profile/:user', (req, res) => {
    var id = Number.parseInt(req.params.user);
    data.getProfile(id)
        .then(profile => {
            return res.render('view-profile', {
                title: `${profile.name}'s Profile - Queazy`,
                profile: {
                    id: profile.id,
                    name: profile.name
                },
                user: req.session ? req.session.user : null
            });
        })
        .catch(reason => {
            return res.redirect('/404');
        });
});

router.get('/profile', checkLoggedIn, (req, res) => {
    return res.redirect(`/profile/${req.session.user.id}`);
});

router.get('/editprofile', checkLoggedIn, (req, res) => {
    return res.render('edit-profile', {
        title: 'Edit profile - Queazy',
        user: req.session.user
    });
});

router.post('/editprofile', checkLoggedIn, upload.none(), (req, res) => {
    var type = req.body.type;

    if (type === 'username') {
        data.changeName(req.session.user.id, req.body.username)
            .then(() => {
                return res.render('edit-profile', {
                    title: 'Edit profile - Queazy',
                    genres: req.genres,
                    user: req.session.user,
                    where: 'username',
                    error: false,
                    message: 'Successfully changed username.'
                });
            })
            .catch(reason => {
                return res.render('edit-profile', {
                    title: 'Edit profile - Queazy',
                    genres: req.genres,
                    user: req.session.user,
                    where: 'username',
                    error: true,
                    message: reason
                });
            });
    } else if (type === 'password') {
        data.changePassword(req.session.user.id, req.body.oldPass, req.body.newPass, req.body.confirm)
            .then(() => {
                return res.render('edit-profile', {
                    title: 'Edit profile - Queazy',
                    genres: req.genres,
                    user: req.session.user,
                    where: 'password',
                    error: false,
                    message: 'Successfully changed password.'
                });
            })
            .catch(reason => {
                return res.render('edit-profile', {
                    title: 'Edit profile - Queazy',
                    genres: req.genres,
                    user: req.session.user,
                    where: 'password',
                    error: true,
                    message: reason
                });
            });
    } else {
        res.redirect('/404');
    }
});

module.exports = router;

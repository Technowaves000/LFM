function checkLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect(`/login?returnUrl=${encodeURIComponent(req.path)}`)
    }
}

module.exports = checkLoggedIn;

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const cookies = req.get('Cookie');
    // const isLoggedInCookie = cookies ? cookies.split('; ').find(cookie => cookie.includes('isLoggedIn')) : null;
    // const isLoggedIn = isLoggedInCookie ? isLoggedInCookie.split('=')[1] === 'true' : false;

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};


exports.postLogin = (req, res, next) => {
    User.findById('65d4ca5d060e0df0af6dfb79')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));

};
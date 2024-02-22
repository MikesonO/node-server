exports.getLogin = (req, res, next) => {
    // const cookies = req.get('Cookie');
    // const isLoggedInCookie = cookies ? cookies.split('; ').find(cookie => cookie.includes('isLoggedIn')) : null;
    // const isLoggedIn = isLoggedInCookie ? isLoggedInCookie.split('=')[1] === 'true' : false;

    console.log(req.session.isLoggedIn)

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};


exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
};
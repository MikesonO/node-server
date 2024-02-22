exports.getLogin = (req, res, next) => {
    const cookies = req.get('Cookie');
    const isLoggedInCookie = cookies ? cookies.split('; ').find(cookie => cookie.includes('isLoggedIn')) : null;
    const isLoggedIn = isLoggedInCookie ? isLoggedInCookie.split('=')[1] === 'true' : false;

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};


exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
};
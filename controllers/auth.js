const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { MailtrapClient } = require("mailtrap");
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { reset } = require('nodemon');

// MailTrap API
const TOKEN = "c181aed16a2b15208b679cc29388ed51";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });


const getFlashMessage = (message) => {
    if (message.length > 0) {
        return message = message[0];
    } else {
        return message = null;
    }
}

exports.getLogin = (req, res, next) => {

    let successMsg = getFlashMessage(req.flash('success'));
    let errorMsg = getFlashMessage(req.flash('error'));

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        successMessage: successMsg,
        errorMessage: errorMsg,
        oldInput: { email: '', password: '' },
        validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
    let message = getFlashMessage(req.flash('error'));

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            successMessage: null,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password.',
                    successMessage: null,
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        successMessage: null,
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            const error = new Error('Post Login failed.')
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, confirmPassword: confirmPassword },
            validationErrors: errors.array()
        });
    }


    return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            });
            return user.save();
        })
        .then(result => {
            req.flash('success', 'Signup successful!');
            res.redirect('/login');
            if (email === 'mikeson.jnr@gmail.com') {
                return client.send({
                    from: { email: 'shop@demomailtrap.com' },
                    to: [{ email: email }],
                    subject: 'Signup suceeded!',
                    text: 'You successfully signed up!'
                });
            }
            return console.log('Signup successful!');
        })
        .catch(err => {
            const error = new Error('Post Signup failed.')
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getResetPassword = (req, res, next) => {

    let message = getFlashMessage(req.flash('error'));

    res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
};

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password')
        }

        // Generate token
        const token = buffer.toString('hex');

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset-password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return client.send({
                    from: { email: 'shop@demomailtrap.com' },
                    to: [{ email: req.body.email }],
                    subject: 'Password reset',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
                    `
                });

            })
            .catch(err => {
                const error = new Error('Post Reset Password failed.')
                error.httpStatusCode = 500;
                return next(error);
            });

    })
};


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    // gt = greater than
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {

            let message = getFlashMessage(req.flash('error'));

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });

        })
        .catch(err => {
            const error = new Error('Get New Password failed.')
            error.httpStatusCode = 500;
            return next(error);
        });


}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;

            return resetUser.save();
        })
        .then(result => {
            req.flash('success', 'Password successfully changed.');
            return res.redirect('/login');
        })
        .catch(err => {
            const error = new Error('Post New Password failed.')
            error.httpStatusCode = 500;
            return next(error);
        });
};


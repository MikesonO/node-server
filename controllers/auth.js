const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { MailtrapClient } = require("mailtrap");

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
        errorMessage: errorMsg
    });
};

exports.getSignup = (req, res, next) => {
    let message = getFlashMessage(req.flash('error'));

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/')
                    });
                }
                req.flash('error', 'Invalid email or password.');
                res.redirect('/login');

            }).catch(err => {
                console.log(err);
                res.redirect('/login')
            });

        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({
        email: email
    })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Oops! Email exists. Please log in or use a different one.');
                return res.redirect('/signup');
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
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
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
                console.log(err);
            })

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
            console.log(err);
        })


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
            console.log(err);
        })
};


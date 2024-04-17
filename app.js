const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');

const errorControllers = require('./controllers/errors.js');
const User = require('./models/user.js');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csurf();


// Handles image file storage
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

// Handles image file type 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const authRoutes = require('./routes/auth.js');

app.use(helmet());


app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err))
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(authRoutes);


app.get('/500', errorControllers.get500);

app.use(errorControllers.get404);

app.use((error, req, res, next) => {
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Server Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });
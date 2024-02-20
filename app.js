const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorControllers = require('./controllers/errors.js');
const User = require('./models/user.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('65c2664413fae1e5fd8a601b')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorControllers.get404);

mongoose.connect('mongodb+srv://Mike:T0wtSsPws1dOPuFL@cluster.8oboqne.mongodb.net/')
    .then(results => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

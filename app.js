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

const authRoutes = require('./routes/auth.js');


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('65d4ca5d060e0df0af6dfb79')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(authRoutes);



app.use(errorControllers.get404);

mongoose.connect('mongodb+srv://Mike:T0wtSsPws1dOPuFL@cluster.8oboqne.mongodb.net/shop?retryWrites=true')
    .then(results => {
        // If there are no users - create a new one
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Mike',
                    email: 'mike@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
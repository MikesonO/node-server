const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorControllers = require('./controllers/errors.js');
const mongoConnect = require('./util/database').mongoConnect;
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


mongoConnect(() => {
    app.listen(3000);
});


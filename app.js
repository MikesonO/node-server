const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorControllers = require('./controllers/errors.js');
const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorControllers.get404);


mongoConnect((client) => {
    console.log(client);
    app.listen(3000);
});


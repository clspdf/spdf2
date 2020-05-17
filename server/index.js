const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MY_CONFIG = require('../my_config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const {user_db} = require('./dbConnection/db');
const login_api = require('./api/login');
const todo_api = require('./api/todos');

const app = express();

// middleware

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//Session configuration

app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: MY_CONFIG.COOKIE_SECRET,
    store: new MongoStore({mongooseConnection: user_db}),
    cookie: {
        maxAge: MY_CONFIG.COOKIE_MAXAGE,
        sameSite: false,
        secure: false
    }
}));


// backend api/routes

app.use('/api/user', login_api);
app.use('/api/todos', todo_api);
// Starting port

app.listen(MY_CONFIG.PORT, () => console.log(`Server up and running on Port ${MY_CONFIG.PORT}`));

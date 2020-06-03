const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MY_CONFIG = require('../my_config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const {user_db} = require('./dbConnection/db');
const login_api = require('./api/login');
const project_api = require('./api/projects');
const projectTodos_api = require('./api/projectTodos');
const projectRemarks_api = require('./api/projectRemarks');
const todo_api = require('./api/todos');
const draft = require('./api/draft');
const path = require('path');

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
app.use('/api/projects', project_api);
app.use('/api/projectTodos', projectTodos_api);
app.use('/api/projectRemarks', projectRemarks_api);
app.use('/test', draft);


// Starting port

if (MY_CONFIG.PRODUCTION_MODE) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
}



app.listen(MY_CONFIG.PORT, () => console.log(`Server up and running on Port ${MY_CONFIG.PORT}`));
